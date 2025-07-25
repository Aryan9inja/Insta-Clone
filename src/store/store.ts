import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/users.slice";
import followersReducer from "./slices/followers.slice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    followers: followersReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
