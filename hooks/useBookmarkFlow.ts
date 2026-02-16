import { useState, useMemo } from "react";
import { Folder, Bookmark } from "@/types/folder";

export function useBookmarkFlow(postId: string) {
  const [foldersVisible, setFoldersVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);

  const [folders, setFolders] = useState<Folder[]>([
    {
      id: "1",
      name: "Churches",
      cover: "https://picsum.photos/200",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  /* ================= DERIVED ================= */

  const savedFolderIds = useMemo(() => {
    return bookmarks
      .filter((b) => b.postId === postId)
      .map((b) => b.folderId);
  }, [bookmarks, postId]);

  /* ================= ACTIONS ================= */

  const openFolders = () => setFoldersVisible(true);

  const toggleFolder = (folderId: string) => {
    const existing = bookmarks.find(
      (b) => b.postId === postId && b.folderId === folderId
    );

    if (existing) {
      // remove bookmark
      setBookmarks((prev) =>
        prev.filter((b) => b.id !== existing.id)
      );
    } else {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        postId,
        folderId,
        createdAt: new Date().toISOString(),
      };

      setBookmarks((prev) => [...prev, newBookmark]);
    }
  };

  const createFolder = (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      cover: "https://picsum.photos/200",
      createdAt: new Date().toISOString(),
    };

    setFolders((prev) => [...prev, newFolder]);
    setCreateVisible(false);
  };

  return {
    folders,
    savedFolderIds,
    foldersVisible,
    createVisible,
    openFolders,
    setFoldersVisible,
    setCreateVisible,
    toggleFolder,
    createFolder,
  };
}