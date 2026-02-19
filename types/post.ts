export type PostType = "image" | "video" | "carousel" | "text";
export type CategoryId =
  | "all"
  | "love"
  | "trust"
  | "worship"
  | "patience"
  | "prayer";

export interface BasePost {
  id: string;
  type: PostType;
  createdAt: string;
  liked: boolean;
  likesCount: number;
  bookmarked:number;
  bookmarks:string

  author: {
    id: string;
    name: string;
    avatarUrl?: string; // allow require() for local assets
  };

  caption?: string;
}

/* IMAGE */

export interface ImagePost extends BasePost {
  type: "image";
  media: {
    url: string;
  };
}

/* VIDEO */

export interface VideoPost extends BasePost {
  type: "video";
  media: {
    videoUrl: string;
    thumbnailUrl: string;
  };
}

/* CAROUSEL */

export interface CarouselPost extends BasePost {
  type: "carousel";
  media: {
    items: {
      id: string;
      type: "image" | "video";
      url: string;
      thumbnailUrl?: string;
    }[];
  };
}

/* TEXT */

export interface TextPost extends BasePost {
  type: "text";
  media: {
    backgroundImage: string;
    thumbnailUrl: any;
  };
  text: string;
}

export type Post = ImagePost | VideoPost | CarouselPost | TextPost;
