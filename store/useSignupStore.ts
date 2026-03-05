import { create } from "zustand";

interface SignupState {
  email: string | null;
  birthday: string | null;
  password: string | null;
  suggestedUsernames: string[];
  selectedUsername: string | null;

  setEmail: (email: string) => void;
  setBirthday: (birthday: string) => void;
  setPassword: (password: string) => void;
  setSuggestions: (suggestions: string[]) => void;
  setSelectedUsername: (username: string) => void;

  reset: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  email: null,
  birthday: null,
  password: null,
  suggestedUsernames: [],
  selectedUsername: null,

  setEmail: (email) =>
    set({
      email,
    }),

  setBirthday: (birthday) =>
    set({
      birthday,
    }),

  setPassword: (password) =>
    set({
      password,
    }),

  setSuggestions: (suggestions) =>
    set({
      suggestedUsernames: suggestions ?? [],
    }),

  setSelectedUsername: (username) =>
    set({
      selectedUsername: username,
    }),

  reset: () =>
    set({
      email: null,
      birthday: null,
      password: null,
      suggestedUsernames: [],
      selectedUsername: null,
    }),
}));