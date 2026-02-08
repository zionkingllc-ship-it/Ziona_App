import { BackgroundType } from "./background";

/* ---------- Shared ---------- */

export type Author = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type BasePost = {
  id: string;
  type: PostType;
  author: Author;
  likesCount: number;
  liked: boolean;
  createdAt: string;
};

/* ---------- Media ---------- */

export type ImageMedia = {
  type: "image";
  url: string;
};

export type VideoMedia = {
  type: "video";
  url: string;
  thumbnailUrl?: string;
  durationSec?: number;
};

export type PostMedia = ImageMedia | VideoMedia;

/* ---------- Post Variants ---------- */

export type ImagePost = BasePost & {
  type: "image";
  media: ImageMedia;
  caption?: string;
};

export type CarouselPost = BasePost & {
  type: "carousel";
  media: ImageMedia[]; // ordered images
  caption?: string;
};

export type VideoPost = BasePost & {
  type: "video";
  media: VideoMedia;
  caption?: string;
};

export type TextPost = BasePost & {
  type: "text";
  text: string;
  background?: BackgroundType;
};

/* ---------- Union ---------- */

export type Post =
  | ImagePost
  | CarouselPost
  | VideoPost
  | TextPost;

export type PostType =
  | "image"
  | "carousel"
  | "video"
  | "text";