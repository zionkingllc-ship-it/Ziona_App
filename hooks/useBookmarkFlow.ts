import { useState } from "react";
import { Folder } from "@/types/folder";

export function useBookmarkFlow() {
  const [foldersVisible, setFoldersVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);

  const [folders, setFolders] = useState<Folder[]>([
    {
      id: "1",
      name: "Churches",
      cover: "https://picsum.photos/200",
      selected: false,
    },
  ]);

  const openFolders = () => setFoldersVisible(true);

  const selectFolder = (folder: Folder) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folder.id
          ? { ...f, selected: true }
          : { ...f, selected: false }
      )
    );
    setFoldersVisible(false);
  };

  const createFolder = (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      cover: "https://picsum.photos/200",
      selected: false,
    };

    setFolders((prev) => [...prev, newFolder]);
    setCreateVisible(false);
    setFoldersVisible(true);
  };

  return {
    folders,
    foldersVisible,
    createVisible,
    openFolders,
    setFoldersVisible,
    setCreateVisible,
    selectFolder,
    createFolder,
  };
}