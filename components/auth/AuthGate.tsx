import { useAuthStore } from "@/store/useAuthStore";
import { router, useSegments } from "expo-router";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthGate({ children }: Props) {
  const segments = useSegments();

  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (isBootstrapping) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)");
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)/feed");
    }
  }, [isAuthenticated, isBootstrapping, segments]);

  if (isBootstrapping) return null;

  return <>{children}</>;
}
