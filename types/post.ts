export type PostType = "image" | "video" | "text";

export type CategoryId =
  | "all"
  | "love"
  | "trust"
  | "worship"
  | "patience"
  | "prayer";

export interface BasePost{
  id: string;
  type: PostType;
  createdAt: string;

  categories: CategoryId[];

  liked: boolean;
  likesCount: number;

  bookmarked: boolean;
  bookmarks: number;

  author: {
    id: string;
    name: string;
    avatarUrl?: string | number;
  };

  caption?: string;
}

export interface ImagePost extends BasePost {
  type: "image";
  media: {
    items: {
      id: string;
      type: "image" | "video";
      url: string | number;
      thumbnailUrl?: string;
    }[];
  };
}

export interface VideoPost extends BasePost {
  type: "video";
  media: {
    videoUrl: string | number;
    thumbnailUrl?: string;
  };
}

export interface TextPost extends BasePost {
  type: "text";
  media: {
    backgroundImage: string | number;
    thumbnailUrl: string;
  };
  text: string;
}

export type Post = ImagePost | VideoPost | TextPost;


export type CreatePostType = "media" | "text" | "bible";

export interface CreatePostDraft {
  type: CreatePostType;

  media?: {
    uri: string;
    type: "image" | "video";
    thumbnail?: string;
  };

  text?: string;

  category?: CategoryId;

  bibleVerse?: {
    translation: string;
    book: string;
    chapter: number;
    verses: number[];
    text: string;
  };
}