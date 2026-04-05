import { authApi } from "@/services/api/authApi";
import { clearAuthTokens, setAuthTokens } from "@/services/api/client";
import { AuthState, AuthTokens, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


type AuthStore = AuthState & {
  isBootstrapping: boolean;
  isInitializing: boolean;

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
      isInitializing: false,

      /* -------- LOGIN SUCCESS -------- */

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

      /* -------- LOGOUT -------- */

      logout: async () => {
        try {
          console.log("Logging out user");
          await authApi.signOut();
        } catch (err) {
          console.log("Backend logout failed, continuing anyway");
        }
        /* clear axios tokens */ clearAuthTokens();
        /* clear zustand state */ set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          mode: "unauthenticated",
        });
        /* clear persisted storage */ await AsyncStorage.removeItem(
          "auth-storage",
        );
      },

      /* -------- APP START AUTH CHECK -------- */

      initializeAuth: async () => {
        const state = get();

        /* prevent double initialization */
        if (state.isInitializing) return;

        set({ isInitializing: true });

        const tokens = state.tokens;

        if (!tokens?.accessToken) {
          set({
            isBootstrapping: false,
            isInitializing: false,
          });
          return;
        }

        /* restore axios tokens */
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
            isInitializing: false,
          });
        } catch (err) {
          console.log("Auth verification failed, keeping stored session");

          /* do NOT logout automatically */
          set({
            isAuthenticated: false,
            mode: "authenticated",
            isBootstrapping: false,
            isInitializing: false,
          });
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
