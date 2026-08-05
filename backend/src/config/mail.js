import nodemailer from "nodemailer";
import https from "https";

let cachedTestAccount = null;

/**
 * Send email using Brevo HTTP API (v3)
 */
function sendBrevoApi({ to, subject, html, apiKey, senderEmail, senderName }) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      sender: {
        name: senderName || "CampusOS Hostel Portal",
        email: senderEmail || "no-reply@campusos.com"
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html
    });

    const req = https.request("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
        "content-length": Buffer.byteLength(payload)
      }
    }, (res) => {
      let responseBody = "";
      res.on("data", chunk => { responseBody += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(responseBody);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, messageId: parsed.messageId });
          } else {
            reject(new Error(parsed.message || `Brevo API error ${res.statusCode}: ${responseBody}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse Brevo response: ${responseBody}`));
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

export async function sendEmail({ to, subject, html }) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || process.env.MAIL_USER || "no-reply@campusos.com";
  const senderName = process.env.SENDER_NAME || "CampusOS Hostel Portal";

  // 1. Try Brevo HTTP API first if BREVO_API_KEY is configured
  if (brevoApiKey) {
    try {
      const res = await sendBrevoApi({ to, subject, html, apiKey: brevoApiKey, senderEmail, senderName });
      console.log(`\n[Brevo API Email Sent Successfully] Message ID: ${res.messageId} to ${to}`);
      return { success: true, messageId: res.messageId };
    } catch (brevoErr) {
      console.error(`\n⚠️ [Brevo API Email Failed] ${brevoErr.message}`);
      console.log(`Falling back to SMTP / Ethereal...\n`);
    }
  }

  // 2. Try SMTP if MAIL_USER and MAIL_PASS are configured
  const mailHost = process.env.MAIL_HOST || "smtp-relay.brevo.com";
  const mailPort = Number(process.env.MAIL_PORT) || 587;
  const mailUser = process.env.MAIL_USER || "";
  const mailPass = process.env.MAIL_PASS || process.env.BREVO_SMTP_KEY || "";

  if (mailUser && mailPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: mailPort === 465,
        auth: {
          user: mailUser,
          pass: mailPass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to,
        subject,
        html,
      });

      console.log(`\n[SMTP Email Sent Successfully] Message ID: ${info.messageId} to ${to}`);
      return { success: true, info };
    } catch (smtpErr) {
      console.error(`\n⚠️ [SMTP Email Failed] ${smtpErr.message}`);
      console.log(`Falling back to Ethereal Test Mail preview link below...\n`);
    }
  }

  // 3. Fallback: Ethereal test inbox with instant preview link
  try {
    if (!cachedTestAccount) {
      cachedTestAccount = await nodemailer.createTestAccount();
    }

    const testTransporter = nodemailer.createTransport({
      host: cachedTestAccount.smtp.host,
      port: cachedTestAccount.smtp.port,
      secure: cachedTestAccount.smtp.secure,
      auth: {
        user: cachedTestAccount.user,
        pass: cachedTestAccount.pass,
      },
    });

    const testInfo = await testTransporter.sendMail({
      from: `"${senderName}" <no-reply@campusos.com>`,
      to,
      subject,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(testInfo);
    console.log(`\n================ [ETHEREAL MAIL PREVIEW GENERATED] ================`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`🔗 OPEN AND VIEW THIS EMAIL IN BROWSER: ${previewUrl}`);
    console.log(`===================================================================\n`);

    return { success: true, previewUrl, simulated: true };
  } catch (fallbackErr) {
    console.error(`[Fallback Email Failed]`, fallbackErr.message);
    return { success: false, error: fallbackErr.message };
  }
}
