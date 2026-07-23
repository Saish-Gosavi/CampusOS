const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const authApi = {
  async login(payload) {
    await delay(900);
    console.log("[authApi.login]", payload);
    return { ok: true };
  },
  async forgotPassword(email) {
    await delay(800);
    console.log("[authApi.forgotPassword]", email);
    return { ok: true };
  },
  async verifyOtp(email, otp) {
    await delay(700);
    console.log("[authApi.verifyOtp]", email, otp);
    return { ok: true };
  },
  async resendOtp(email) {
    await delay(500);
    console.log("[authApi.resendOtp]", email);
    return { ok: true };
  },
  async resetPassword(password) {
    await delay(800);
    console.log("[authApi.resetPassword]", password.length);
    return { ok: true };
  }
};
export {
  authApi
};
