import getConfig from "next/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { jwtDecode } from "jwt-decode";
import { EdatLoginResponseType, EdatRegCodeStatusResponseType } from "../types";
import addDefaulHeaders from "../utils/authHeader";

const { publicRuntimeConfig } = getConfig();

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${publicRuntimeConfig.backendApi}`,
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    login: builder.mutation<any, FormData>({
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
      query: ({ userId, orgCode, token, apiRoute, role }) => ({
        url: `/users/${apiRoute}/${role}/${orgCode}?user_id=${userId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items[0] ?? [];
      },
    }),
    userProfileUpdate: builder.query({
      query: ({ userId, orgCode, token, role, apiRoute, data }) => ({
        url: `/users/${apiRoute}/${role}/update/${orgCode}?user_id=${userId}`,
        method: "post",
        body: data,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results ?? {};
      },
    }),
    userProfileImageUpdate: builder.mutation({
      query: ({ userId, orgCode, data, role }) => {
        console.log({ data, orgCode });
        const formData = new FormData();
        formData.append("image", data);
        return {
          url: `/${orgCode}/${userId}/users/profile/${role}/uploadimage`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      transformResponse: (response: any, meta, arg) => {
        return response.results ?? {};
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyGetRegCodeStatusQuery,
  useLazyGetUserNameStatusQuery,
  useLazyGetEmailStatusQuery,
  useSignUpMutation,
  useLazyGetUserQuery,
  useUserProfileUpdateQuery,
  useLazyUserProfileUpdateQuery,
  useUserProfileImageUpdateMutation,
} = userApi;
