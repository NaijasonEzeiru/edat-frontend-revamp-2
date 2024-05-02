import getConfig from "next/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import addDefaulHeaders from "../utils/authHeader";

const { publicRuntimeConfig } = getConfig();

export const parentApi = createApi({
  reducerPath: "parentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${publicRuntimeConfig.backendApi}`,
    prepareHeaders: (headers, { getState }) => {
      const _authHeader = addDefaulHeaders(headers);
      return _authHeader;
    },
  }),
  tagTypes: ["children"],
  endpoints: (builder) => ({
    getChildrenList: builder.query({
      query: ({ orgCode, userId }) => ({
        url: `${orgCode}/${userId}/parent/children/list`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
      providesTags: ["children"],
    }),
    getStudentProfile: builder.query({
      query: ({ studentId, orgCode, parentId }) => ({
        url: `/users/profile/student/${orgCode}?user_id=${studentId}&parent_id=${parentId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items[0] ?? [];
      },
    }),
    getStudentsClassRoom: builder.query({
      query: ({ userId, orgCode, parentId }) => ({
        url: `${orgCode}/${userId}/student/list/classroom?parent_id=${parentId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
    }),
    getStudentActivityLists: builder.query({
      query: ({ userId, classId, orgCode, parentId }) => ({
        url: `${orgCode}/${userId}/student/activity/list?class_id=${classId}&parent_id=${parentId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
    }),
    getStudentQuizScore: builder.query({
      query: ({ userId, orgCode, request, parentId }) => ({
        url: `${orgCode}/${userId}/student/activity/score?parent_id=${parentId}`,
        method: "post",
        body: request,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items[0] ?? [];
      },
    }),
    getSubjectsMetrics: builder.query({
      query: ({ userId, orgCode, classId, subjectId, parentId }) => ({
        url: `${orgCode}/${userId}/student/charts/student-score/radar?class_id=${classId}&subject_id=${subjectId}&student_id=${userId}&parent_id=${parentId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results ?? [];
      },
    }),
    getRecommendation: builder.query({
      query: ({ userId, orgCode, classId, subjectId, studentId }) => ({
        url: `${orgCode}/${userId}/student/charts/student-recommendation/subject?class_id=${classId}&subject_id=${subjectId}&user_id=${studentId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response;
      },
    }),
    addChild: builder.mutation({
      query: ({ orgCode, userId, student_reg_code }) => ({
        url: `${orgCode}/${userId}/parent/children/add?student_reg_code=${student_reg_code}`,
        method: "post",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
      invalidatesTags: ["children"],
    }),
  }),
});

export const {
  useLazyGetChildrenListQuery,
  useAddChildMutation,
  useGetChildrenListQuery,
  useGetStudentProfileQuery,
  useLazyGetStudentsClassRoomQuery,
  useLazyGetStudentActivityListsQuery,
  useLazyGetStudentQuizScoreQuery,
  useLazyGetSubjectsMetricsQuery,
  useLazyGetRecommendationQuery,
} = parentApi;
