import {BasePost } from "./post"; 

type FeedStatus = "idle" | "loading" | "success" | "empty" | "error";

type FeedState = {
  data: BasePost
  status: FeedStatus;
  error?: string;
};

type FeedStore = {
  forYou: FeedState;
  following: FeedState;
};

