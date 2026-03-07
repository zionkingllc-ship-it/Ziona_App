import { useEffect } from "react";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

import { authApi } from "@/services/api/authApi";
import { useAuthStore } from "@/store/useAuthStore";

// Configure Google Signin
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  offlineAccess: true,
});

export const useGoogleAuth = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google Sign-In...");

      // Ensure Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Launch Google login
      const userInfo = await GoogleSignin.signIn();

      console.log("Google user info:", userInfo);

      // Extract ID Token
      let idToken = userInfo.data?.idToken;

      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }

      if (!idToken) {
        throw new Error("Google returned null idToken");
      }

      console.log("====== GOOGLE LOGIN SUCCESS ======");
      console.log("Google ID Token:", idToken);
      console.log("Google User:", userInfo.data?.user);

      // Send token to backend
      const res = await authApi.googleLogin(idToken);

      console.log("Backend Google response:", res);

      if (res.user && res.tokens) {
        setAuth(res.user, res.tokens);
        console.log("User authenticated successfully");
      } else {
        console.log("Backend did not return expected auth payload");
      }

    } catch (error: any) {
      console.error("Google Sign-In error:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled Google sign-in");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Google sign-in already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Google Play Services not available or outdated");
      } else {
        console.log("Unexpected Google login error");
      }
    }
  };

  return {
    signInWithGoogle,
  };
};


