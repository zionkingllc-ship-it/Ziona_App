import { Post } from "./post"; 

type FeedStatus = "idle" | "loading" | "success" | "empty" | "error";

type FeedState = {
  data: Post
  status: FeedStatus;
  error?: string;
};

type FeedStore = {
  forYou: FeedState;
  following: FeedState;
};

