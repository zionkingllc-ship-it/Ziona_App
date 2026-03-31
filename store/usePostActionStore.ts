import { create } from "zustand";

type PostActionsState = {
  likedPosts: Record<string, boolean>;
  savedPosts: Record<string, boolean>;

  toggleLike: (postId: string, currentValue?: boolean) => void;
  toggleSave: (postId: string, currentValue?: boolean) => void;

  clear: () => void;
};

export const usePostActionsStore = create<PostActionsState>((set) => ({
  likedPosts: {},
  savedPosts: {},

  toggleLike: (postId, currentValue) =>
    set((state) => ({
      likedPosts: {
        ...state.likedPosts,
        [postId]: !(state.likedPosts[postId] ?? currentValue ?? false),
      },
    })),

  toggleSave: (postId, currentValue) =>
    set((state) => ({
      savedPosts: {
        ...state.savedPosts,
        [postId]: !(state.savedPosts[postId] ?? currentValue ?? false),
      },
    })),

  clear: () => set({ likedPosts: {}, savedPosts: {} }),
}));