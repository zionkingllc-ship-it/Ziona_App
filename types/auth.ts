// types/auth.ts
import { User } from "./user";
import { AuthTokens } from "./api";
export type AuthMode = "authenticated" | "guest" | "unauthenticated";

export type AuthState = {
  mode: AuthMode;
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
};
 
export type SignUpResponse = {
  user: User
  tokens: AuthTokens
}