// Placeholder API service. Replace baseURL and wire real endpoints later.
// No real requests are made from these methods; they simulate latency for UX.

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const authApi = {
  async login(payload: { email: string; password: string; remember: boolean }) {
    await delay(900);
    // eslint-disable-next-line no-console
    console.log("[authApi.login]", payload);
    return { ok: true };
  },
  async forgotPassword(email: string) {
    await delay(800);
    console.log("[authApi.forgotPassword]", email);
    return { ok: true };
  },
  async verifyOtp(email: string, otp: string) {
    await delay(700);
    console.log("[authApi.verifyOtp]", email, otp);
    return { ok: true };
  },
  async resendOtp(email: string) {
    await delay(500);
    console.log("[authApi.resendOtp]", email);
    return { ok: true };
  },
  async resetPassword(password: string) {
    await delay(800);
    console.log("[authApi.resetPassword]", password.length);
    return { ok: true };
  },
};
