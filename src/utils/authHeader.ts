import {
  createApi,
  fetchBaseQuery,
  // baseQuery,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { useSelector } from "react-redux";
import { AppStore } from "../store/store"; // Import your RootState type

const addDefaulHeaders = (headers: Headers): Headers => {
  let token = localStorage.getItem("edat_token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    // headers.set('Cache-Control', 'max-age=30');
  }
  // if (!headers.has("Content-Type")) {
  //   headers.set("Content-Type", "application/json");
  // }
  return headers;
};

export default addDefaulHeaders;
