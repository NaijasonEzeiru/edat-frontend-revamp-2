import getConfig from "next/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { jwtDecode } from "jwt-decode";
import { EdatLoginResponseType, EdatRegCodeStatusResponseType } from "../types";
import addDefaulHeaders from "../utils/authHeader";

const { publicRuntimeConfig } = getConfig();

export const onBoardApi = createApi({
  reducerPath: "onBoardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${publicRuntimeConfig.backendApi}`,
    prepareHeaders: (headers, { getState }) => {
      const _authHeader = addDefaulHeaders(headers);
      return _authHeader;
    },
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: (request) => ({
        url: `/login`,
        method: "post",
        body: request,
      }),
      transformResponse: (response: EdatLoginResponseType, meta, arg) => {
        if (response.errors.code) {
          return response.errors;
        }
        localStorage.setItem("edat_token", response.results.items.token);
        return jwtDecode(response.results.items.token);
      },
    }),
    getRegCodeStatus: builder.query({
      query: ({ code }) => `/reg-code/${code}`,
    }),
    getUserNameStatus: builder.query({
      query: ({ username }) => `/validate?username=${username}`,
    }),
    getEmailStatus: builder.query({
      query: ({ email }) => `/validate?emails=${email}`,
    }),
    signUp: builder.mutation<any, any>({
      query: (request) => ({
        url: "/users/signup",
        method: "post",
        body: request,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response;
      },
    }),
    getUser: builder.query({
      query: ({ userId, orgCode, apiRoute, role }) => ({
        url: `/${orgCode}/${userId}/users/profile/${role}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items[0] ?? [];
      },
      providesTags: ["Profile"],
    }),
    userProfileUpdate: builder.mutation({
      query: ({ userId, orgCode, role, data }) => ({
        url: `/users/profile/${role}/update/${orgCode}?user_id=${userId}`,
        method: "post",
        body: data,
      }),
      invalidatesTags: ["Profile"],
      transformResponse: (response: any, meta, arg) => {
        return response.results ?? {};
      },
    }),
    userProfilePictureUpdate: builder.mutation({
      query: ({ userId, orgCode, data, role }) => {
        return {
          url: `${orgCode}/${userId}/users/profile/${role}/uploadimage`,
          method: "post",
          body: data,
          formData: true,
        };
      },
      invalidatesTags: ["Profile"],
      transformResponse: (response: any, meta, arg) => {
        return response.results ?? {};
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetRegCodeStatusQuery,
  useLazyGetRegCodeStatusQuery,
  useGetUserNameStatusQuery,
  useLazyGetUserNameStatusQuery,
  useGetEmailStatusQuery,
  useLazyGetEmailStatusQuery,
  useSignUpMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
  useUserProfileUpdateMutation,
  useUserProfilePictureUpdateMutation,
} = onBoardApi;
