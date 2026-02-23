import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Comment {
  id: string;
  postId: string;
  text: string;
  createdAt: string;
}

interface PostActionsState {
  likes: Record<string, boolean>;
  bookmarks: Record<string, string[]>;
  flagged: Record<string, boolean>;
  comments: Record<string, Comment[]>;

  toggleLike: (postId: string) => void;
  toggleFlag: (postId: string) => void;
  addBookmark: (postId: string, folderId: string) => void;
  removeBookmark: (postId: string, folderId: string) => void;
  addComment: (postId: string, text: string) => void;
}

export const usePostActionsStore = create<PostActionsState>()(
  persist(
    (set, get) => ({
      likes: {},
      bookmarks: {},
      flagged: {},
      comments: {},

      toggleLike: (postId) => {
        set((state) => ({
          likes: {
            ...state.likes,
            [postId]: !state.likes[postId],
          },
        }));
      },

      toggleFlag: (postId) => {
        set((state) => ({
          flagged: {
            ...state.flagged,
            [postId]: !state.flagged[postId],
          },
        }));
      },

      addBookmark: (postId, folderId) => {
        set((state) => {
          const current = state.bookmarks[postId] || [];
          if (current.includes(folderId)) return state;

          return {
            bookmarks: {
              ...state.bookmarks,
              [postId]: [...current, folderId],
            },
          };
        });
      },

      removeBookmark: (postId, folderId) => {
        set((state) => ({
          bookmarks: {
            ...state.bookmarks,
            [postId]: (state.bookmarks[postId] || []).filter(
              (id) => id !== folderId
            ),
          },
        }));
      },

      addComment: (postId, text) => {
        const newComment: Comment = {
          id: Date.now().toString(),
          postId,
          text,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          comments: {
            ...state.comments,
            [postId]: [...(state.comments[postId] || []), newComment],
          },
        }));
      },
    }),
    {
      name: "post-actions-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);