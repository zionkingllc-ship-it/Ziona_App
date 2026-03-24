import { Category } from "@/types/category";
import { BibleVerse, CreatePostDraft, MediaItem } from "@/types/createPost";

import { create } from "zustand";

type StartDraftType = "text" | "media" | "bible";

interface CreatePostState {
  draft: CreatePostDraft | null;

  startDraft: (type: StartDraftType, mediaType?: "image" | "video") => void;

  setText: (text: string) => void;

  setMedia: (items: MediaItem[]) => void;

  setCategory: (category: Category) => void;

  setBibleVerse: (bible: BibleVerse) => void;

  setCaption: (caption: string) => void;

  resetDraft: () => void;
}

const MAX_LENGTH = 500;

export const useCreatePostStore = create<CreatePostState>((set) => ({
  draft: null,

  /* =========================
     START DRAFT
  ========================= */

  startDraft: (type, mediaType) =>
    set((state) => {
      const prevText =
        state.draft?.type === "text" || state.draft?.type === "bible"
          ? (state.draft.text ?? "")
          : "";

      const prevCategory = state.draft?.category;

      if (type === "text") {
        return {
          draft: {
            type: "text",
            text: prevText,
            category: prevCategory ?? ({} as Category),
          },
        };
      }

      if (type === "media") {
        if (!mediaType) throw new Error("mediaType required");

        return {
          draft: {
            type: "media",
            mediaType,
            media: { items: [] },
            category: prevCategory ?? ({} as Category),
          },
        };
      }

      if (type === "bible") {
        return {
          draft: {
            type: "bible",
            bibleVerse:
              state.draft?.type === "bible"
                ? state.draft.bibleVerse
                : ({} as BibleVerse),
            text:
              state.draft?.type === "text" || state.draft?.type === "bible"
                ? (state.draft.text ?? "")
                : "",
            category: state.draft?.category ?? ({} as Category),
          },
        };
      }

      return { draft: state.draft };
    }),

  /* =========================
     TEXT
  ========================= */

  setText: (text) =>
    set((state) => {
      if (!state.draft) return state;

      if (text.length > MAX_LENGTH) return state;

      if (state.draft.type === "text") {
        return {
          draft: { ...state.draft, text },
        };
      }

      if (state.draft.type === "bible") {
        return {
          draft: { ...state.draft, text },
        };
      }

      return state;
    }),

  /* =========================
     MEDIA
  ========================= */

  setMedia: (items) =>
    set((state) => {
      if (!state.draft || state.draft.type !== "media") return state;

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
      if (!state.draft) return state;

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
      if (!state.draft) return state;

      if (state.draft.type === "text") {
        return {
          draft: {
            type: "bible",
            text: state.draft.text,
            bibleVerse: bible,
            category: state.draft.category,
          },
        };
      }

      if (state.draft.type === "bible") {
        return {
          draft: {
            ...state.draft,
            bibleVerse: bible,
          },
        };
      }

      return state;
    }),

  /* =========================
     CAPTION (MEDIA ONLY)
  ========================= */

  setCaption: (caption: string) =>
    set((state) => {
      if (!state.draft || state.draft.type !== "media") return state;

      return {
        draft: {
          ...state.draft,
          caption,
        },
      };
    }),

  /* =========================
     RESET
  ========================= */

  resetDraft: () => set({ draft: null }),
}));
