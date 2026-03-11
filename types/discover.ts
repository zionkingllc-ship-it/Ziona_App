

export type DiscoverPost = {
  id: string;
  type: "image" | "video" | "text";
  media?: { url: string; thumbnailUrl?: string }[];
  text?: string;
};

export type DiscoverCategory = {
  id: string
  label: string
  slug: string
  icon: string
  bgColor: string
  bdColor: string
  order?: number
}