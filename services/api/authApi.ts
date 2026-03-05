// services/api/authApi.ts

import { User } from "@/types";
import { api } from "./client";

/* ---------------- DEBUG HELPERS ---------------- */

const log = (...args: any[]) => {
  console.log("🟦 AUTH API:", ...args);
};

const errorLog = (...args: any[]) => {
  console.error("🟥 AUTH API ERROR:", ...args);
};

export const authApi = {
  signUp: async (payload: {
    email: string;
    password: string;
    username: string;
    birthday: string;
  }): Promise<{ user: User }> => {
    try {
      log("signUp called");
      log("Payload:", payload);

      const response = await api.post("/auth/register", {
        email: payload.email,
        password: payload.password,
        username: payload.username,
        date_of_birth: payload.birthday,
      });

      log("signUp response:", response.data);

      return {
        user: response.data?.data?.user,
      };
    } catch (err: any) {
      errorLog("signUp failed:", err?.response?.data || err);
      throw err;
    }
  },

  signIn: async (payload: { email: string; password: string }) => {
    try {
      log("signIn called");
      log("Payload:", payload);

      const response = await api.post("/auth/login", {
        email: payload.email,
        password: payload.password,
      });

      log("signIn response:", response.data);

      const data = response.data?.data ?? response.data ?? {};

      return {
        requiresOtp: data.requires_otp ?? false,
        user: data.user ?? null,
        tokens: data.tokens ?? null,
      };
    } catch (err: any) {
      errorLog("signIn failed:", err?.response?.data || err);
      throw err;
    }
  },

  verifyOtp: async (payload: { email: string; code: string }) => {
    try {
      log("verifyOtp called");
      log("Payload:", payload);

      const response = await api.post("/auth/verify-email", {
        email: payload.email,
        code: payload.code,
      });

      log("verifyOtp response:", response.data);

      const data = response.data?.data ?? {};

      return {
        user: data.user ?? null,
        tokens: data.tokens ?? null,
      };
    } catch (err: any) {
      errorLog("verifyOtp failed:", err?.response?.data || err);
      throw err;
    }
  },

  resendOtp: async (email: string) => {
    try {
      log("resendOtp called");
      log("Email:", email);

      const response = await api.post("/auth/resend-otp", {
        email,
      });

      log("resendOtp response:", response.data);

      return response.data;
    } catch (err: any) {
      errorLog("resendOtp failed:", err?.response?.data || err);
      throw err;
    }
  },

  suggestUsername: async (payload: {
    email: string;
    date_of_birth: string;
  }) => {
    try {
      log("suggestUsername called");
      log("Payload:", payload);

      const response = await api.post("/auth/suggest-usernames", payload);

      log("suggestUsername response:", response.data);

      return response.data?.data?.suggestions ?? [];
    } catch (err: any) {
      errorLog("suggestUsername failed:", err?.response?.data || err);
      throw err;
    }
  },

  requestPasswordReset: async (email: string) => {
    try {
      log("requestPasswordReset called");
      log("Email:", email);

      const response = await api.post("/auth/password-reset", {
        email,
      });

      log("requestPasswordReset response:", response.data);

      return response.data;
    } catch (err: any) {
      errorLog("requestPasswordReset failed:", err?.response?.data || err);
      throw err;
    }
  },

  confirmPasswordReset: async (payload: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    try {
      log("confirmPasswordReset called");
      log("Payload:", payload);

      const response = await api.post("/auth/password-reset/confirm", {
        email: payload.email,
        otp: payload.otp,
        new_password: payload.newPassword,
      });

      log("confirmPasswordReset response:", response.data);

      return response.data;
    } catch (err: any) {
      errorLog("confirmPasswordReset failed:", err?.response?.data || err);
      throw err;
    }
  },

  googleLogin: async (idToken: string) => {
    try {
      log("googleLogin called");

      const response = await api.post("/auth/google", {
        id_token: idToken,
      });

      log("googleLogin response:", response.data);

      return response.data;
    } catch (err: any) {
      errorLog("googleLogin failed:", err?.response?.data || err);
      throw err;
    }
  },

  getMe: async (): Promise<User> => {
    try {
      log("getMe called");

      const response = await api.get("/auth/me");

      log("getMe response:", response.data);

      return response.data;
    } catch (err: any) {
      errorLog("getMe failed:", err?.response?.data || err);
      throw err;
    }
  },

  signOut: async () => {
    try {
      log("signOut called");

      const response = await api.post("/auth/logout");

      log("signOut response:", response?.data);
    } catch (err: any) {
      errorLog("signOut failed:", err?.response?.data || err);
      throw err;
    }
  },
};