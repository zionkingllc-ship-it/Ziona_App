import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { authApi } from "@/services/api/authApi";
import { useAuthStore } from "@/store/useAuthStore";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {

  const setAuth = useAuthStore((s) => s.setAuth);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {

      if (response?.type !== "success") return;

      const idToken = response.authentication?.idToken;

      if (!idToken) return;

      try {

        console.log("GOOGLE LOGIN TOKEN:", idToken);

        const res = await authApi.googleLogin(idToken);

        console.log("GOOGLE BACKEND RESPONSE:", res);

        if (res.user && res.tokens) {
          setAuth(res.user, res.tokens);
        }

      } catch (error: any) {
        console.error("GOOGLE LOGIN FAILED:", error?.response?.data || error);
      }
    };

    handleGoogleResponse();
  }, [response]);

  return {
    promptAsync,
    request,
  };
};