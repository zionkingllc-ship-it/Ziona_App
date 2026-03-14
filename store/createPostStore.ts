import { create } from "zustand"
import { CreatePostDraft, CreatePostType } from "@/types/createPost"

interface CreatePostState {
draft: CreatePostDraft | null

startDraft: (type: CreatePostType) => void

updateDraft: (data: Partial<CreatePostDraft>) => void

resetDraft: () => void
}

export const useCreatePostStore = create<CreatePostState>((set) => ({
draft: null,

startDraft: (type) =>
set({
draft: {
type,
},
}),

updateDraft: (data) =>
set((state) => ({
draft: {
...(state.draft ?? { type: "text" }),
...data,
},
})),

resetDraft: () => set({ draft: null }),
}))
