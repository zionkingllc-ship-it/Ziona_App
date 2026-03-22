import {
  BibleVerse,
  CreatePostDraft,
  MediaItem,
} from "@/types/createPost";
import { Category } from "@/types/category";

import { create } from "zustand";

type StartDraftType = "text" | "media" | "bible";

interface CreatePostState {
  draft: CreatePostDraft | null;

  startDraft: (type: StartDraftType, mediaType?: "image" | "video") => void;

  setText: (text: string) => void;

  setMedia: (items: MediaItem[]) => void;

  setCategory: (category: Category) => void;

  setBibleVerse: (bible: BibleVerse | null) => void;

  resetDraft: () => void;
}

const MAX_LENGTH = 500;

export const useCreatePostStore = create<CreatePostState>((set) => ({
  draft: null,

  /* =========================
     START DRAFT
  ========================= */

  startDraft: (type, mediaType) => {
    if (type === "text") {
      return set({
        draft: {
          type: "text",
          text: "",
          category: {} as Category, // temporary until selected
        },
      });
    }

    if (type === "media") {
      if (!mediaType) throw new Error("mediaType required");

      return set({
        draft: {
          type: "media",
          mediaType,
          media: { items: [] },
          category: {} as Category,
        },
      });
    }

    if (type === "bible") {
      return set({
        draft: {
          type: "bible",
          bibleVerse: {} as BibleVerse,
          category: {} as Category,
        },
      });
    }
  },

  /* =========================
     TEXT
  ========================= */

  setText: (text) =>
    set((state) => {
      if (!state.draft || state.draft.type !== "text") {
        return { draft: state.draft };
      }

      if (text.length > MAX_LENGTH) {
        return { draft: state.draft };
      }

      return {
        draft: {
          ...state.draft,
          text,
        },
      };
    }),

  /* =========================
     MEDIA
  ========================= */

  setMedia: (items) =>
    set((state) => {
      if (!state.draft || state.draft.type !== "media") {
        return { draft: state.draft };
      }

      return {
        draft: {
          ...state.draft,
          media: { items },
        },
      };
    }),

  /* =========================
     CATEGORY
  ========================= */

  setCategory: (category) =>
    set((state) => {
      if (!state.draft) return { draft: state.draft };

      return {
        draft: {
          ...state.draft,
          category,
        },
      };
    }),

  /* =========================
     BIBLE
  ========================= */

  setBibleVerse: (bible) =>
    set((state) => {
      if (!state.draft || state.draft.type !== "bible") {
        return { draft: state.draft };
      }

      return {
        draft: {
          ...state.draft,
          bibleVerse: bible ?? ({} as BibleVerse),
        },
      };
    }),

  /* =========================
     RESET
  ========================= */

  resetDraft: () => set({ draft: null }),
}));