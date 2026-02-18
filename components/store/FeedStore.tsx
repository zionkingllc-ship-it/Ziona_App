 import React, { createContext, useContext, useState, ReactNode } from "react";
import { Post } from "@/types/post";

type FeedKey = string; // e.g., "discover:love"

interface FeedStoreType {
  feeds: Record<FeedKey, Post[]>;
  setFeed: (key: FeedKey, posts: Post[]) => void;
  getFeed: (key: FeedKey) => Post[] | undefined;
}

const FeedContext = createContext<FeedStoreType | undefined>(undefined);

export const FeedProvider = ({ children }: { children: ReactNode }) => {
  const [feeds, setFeeds] = useState<Record<FeedKey, Post[]>>({});

  const setFeed = (key: FeedKey, posts: Post[]) => {
    setFeeds((prev) => ({ ...prev, [key]: posts }));
  };

  const getFeed = (key: FeedKey) => feeds[key];

  return (
    <FeedContext.Provider value={{ feeds, setFeed, getFeed }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeedStore = () => {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeedStore must be used inside FeedProvider");
  return ctx;
};