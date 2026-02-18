export type DiscoverCategory = {
  id: string;
  label: string;
  icon: any; // Image require or URI
  bgColor: string;
};

export type DiscoverPost = {
  id: string;
  type: "image" | "video" | "text";
  media?: { url: string; thumbnailUrl?: string }[];
  text?: string;
};
