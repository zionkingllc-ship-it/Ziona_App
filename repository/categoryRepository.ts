import { Category } from "@/types/category"
import { DISCOVER_CATEGORIES } from "@/constants/discoverCategories"

export async function getCategories(): Promise<Category[]> {
return DISCOVER_CATEGORIES.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}


//   export async function getCategories(): Promise<DiscoverCategory[]> {
//   const res = await api.get("/categories");                               // production
//   return res.data;
//}