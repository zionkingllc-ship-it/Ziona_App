import { useEffect, useState } from "react";
import { bibleRepository } from "@/repository";

export function useBibleChapters(book: string) {
  const [chapters, setChapters] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!book) return;

    setLoading(true);

    bibleRepository
      .getChapters(book)
      .then((res) => {
        setChapters(res.chapters);
      })
      .finally(() => setLoading(false));
  }, [book]);

  return { chapters, loading };
}