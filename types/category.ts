export interface Category {
  id: string;
  label: string;
  slug: string;

  icon?: {
    uri: string;
  };

  bgColor: string;
  bdColor: string;

  order?: number;
}