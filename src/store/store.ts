"use client";

import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  Middleware,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import EventBus from "../utils/eventBus";
import { authSlice, loadAuthState, setAuthState } from "./authSlice";
import { studentSlice } from "./studentSlice";
import { createWrapper } from "next-redux-wrapper";
import { onBoardApi } from "../services/onBoardApi";
import { studentApi } from "../services/studentApi";
import { parentApi } from "../services/parentApi";
import { teacherApi } from "../services/teacherApi";
import { userApi } from "../services/userApi";
import { classRoomApi } from "../services/classRoomApi";
import { contentApi } from "../services/contentApi";
import { quizSlice } from "./quizSlice";

const apiErrorMiddleware = (store) => (next) => async (action) => {
  if (
    action.hasOwnProperty("meta") &&
    action.meta.hasOwnProperty("baseQueryMeta") &&
    action.meta.baseQueryMeta.hasOwnProperty("response")
  ) {
    if (action.meta.baseQueryMeta.response.status) {
      const statusCode = action.meta.baseQueryMeta.response.status;

      if (statusCode === 200) {
      } else if (statusCode === 401) {
        // Handle resource not found error
        // For example, you can show a not found message to the user
        // store.dispatch(showNotFoundError());
        console.log("TOKEN expired...");
        EventBus.emit("TOKEN_EXPIRED", "Sesion Expired");
      } else if (statusCode === 403) {
        // Handle resource not found error
        // For example, you can show a not found message to the user
        // store.dispatch(showNotFoundError());
        //EventBus.emit("TOKEN_EXPIRED", "Sesion Expired")
      }
    }
  }

  return next(action);
};

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [quizSlice.name]: quizSlice.reducer,
  [studentSlice.name]: studentSlice.reducer,
  [studentApi.reducerPath]: studentApi.reducer,
  [parentApi.reducerPath]: parentApi.reducer,
  [teacherApi.reducerPath]: teacherApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [classRoomApi.reducerPath]: classRoomApi.reducer,
  [onBoardApi.reducerPath]: onBoardApi.reducer,
  [contentApi.reducerPath]: contentApi.reducer,
});

const authMiddleware: Middleware = (store) => (next) => (action) => {
  if (setAuthState.match(action)) {
    localStorage.setItem("isAuthenticated", "true");
  }
  return next(action);
};

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      onBoardApi.middleware,
      teacherApi.middleware,
      studentApi.middleware,
      parentApi.middleware,
      userApi.middleware,
      classRoomApi.middleware,
      contentApi.middleware,
      authMiddleware,
      apiErrorMiddleware,
    ],
    devTools: true,
  });

setupListeners(makeStore().dispatch);

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore);
