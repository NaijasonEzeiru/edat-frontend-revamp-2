import getConfig from "next/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import addDefaulHeaders from "../utils/authHeader";

const { publicRuntimeConfig } = getConfig();

export const classRoomApi = createApi({
  reducerPath: "classRoomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${publicRuntimeConfig.backendApi}`,
    prepareHeaders: (headers, { getState }) => {
      const _authHeader = addDefaulHeaders(headers);
      return _authHeader;
    },
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    createClassRoom: builder.mutation<any, any>({
      query: (request) => ({
        url: `${request.org_code}/${request.teacher_id}/teacher/create/classroom`,
        method: "post",
        body: request,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response;
      },
    }),
    listClassRoom: builder.query({
      query: ({ userId, orgCode }) => ({
        url: `/classroom/list?user_id=${userId}&teacher_id=${userId}&org_code=${orgCode}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results ?? [];
      },
    }),
  }),
});

export const {
  useCreateClassRoomMutation,
  useLazyListClassRoomQuery,
  useListClassRoomQuery,
} = classRoomApi;
