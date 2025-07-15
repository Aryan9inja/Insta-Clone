import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./users.slice";

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
