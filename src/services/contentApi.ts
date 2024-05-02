import getConfig from "next/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import addDefaulHeaders from "../utils/authHeader";

const { publicRuntimeConfig } = getConfig();

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${publicRuntimeConfig.backendApi}`,
    prepareHeaders: (headers, { getState }) => {
      const _authHeader = addDefaulHeaders(headers);
      return _authHeader;
    },
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    getSubjects: builder.query({
      query: ({ orgCode, userId }) => ({
        url: `/content/get_subjects?org_code=${orgCode}&user_id=${userId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response ?? [];
      },
    }),
    getLevels: builder.query({
      query: ({ orgCode, userId }) => ({
        url: `/content/get_levels?org_code=${orgCode}&user_id=${userId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response ?? [];
      },
    }),
    getBoards: builder.query({
      query: ({ orgCode, userId }) => ({
        url: `/content/get_boards?org_code=${orgCode}&user_id=${userId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results ?? [];
      },
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useLazyGetSubjectsQuery,
  useGetBoardsQuery,
  useLazyGetBoardsQuery,
  useGetLevelsQuery,
  useLazyGetLevelsQuery,
} = contentApi;
