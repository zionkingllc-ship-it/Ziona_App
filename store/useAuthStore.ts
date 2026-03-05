// store/useAuthStore.ts
import { authApi } from "@/services/api/authApi";
import { clearAuthTokens, setAuthTokens } from "@/services/api/client";
import { AuthState, AuthTokens, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStore = AuthState & {
  isBootstrapping: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      mode: "unauthenticated",
      isBootstrapping: true,

      setAuth: (user, tokens) => {
        setAuthTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });

        set({
          user,
          tokens,
          isAuthenticated: true,
          mode: "authenticated",
        });
      },

      logout: async () => {
        try {
          await authApi.signOut();
        } catch {}

        clearAuthTokens();

        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          mode: "unauthenticated",
        });
      },

      initializeAuth: async () => {
        const { tokens } = get();

        if (!tokens?.accessToken) {
          set({ isBootstrapping: false });
          return;
        }

        setAuthTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });

        try {
          const user = await authApi.getMe();

          set({
            user,
            isAuthenticated: true,
            mode: "authenticated",
            isBootstrapping: false,
          });
        } catch {
          await get().logout();
          set({ isBootstrapping: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        mode: state.mode,
      }),
    },
  ),
);
