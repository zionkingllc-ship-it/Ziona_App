import { Category } from "./category";

export type DiscoverPost = {
  id: string;
  type: "image" | "video" | "text";
  media?: { url: string; thumbnailUrl?: string }[];
  text?: string;
};

export type DiscoverCategory = Category;
