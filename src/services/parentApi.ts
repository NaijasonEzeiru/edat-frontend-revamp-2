import getConfig from "next/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import addDefaulHeaders from "../utils/authHeader";

const { publicRuntimeConfig } = getConfig();

type ChildList = {
  results: {
    items:
      | {
          user_id: string;
          first_name: string;
          last_name: string;
        }[]
      | [];
  };
};

type Result =
  | [
      {
        fullname: string;
        max_score: number;
        student_id: number;
        score_percent: number;
        student_score: number;
        learning_outcome: string;
      }
    ]
  | [];

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
      transformResponse: (response: ChildList, meta, arg) => {
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
    getStudentPerformance: builder.query({
      query: ({ userId, orgCode, parentId }) => ({
        url: `${orgCode}/${userId}/student/report/student-performance-report?parent_id=${parentId}`,
        method: "get",
      }),
      transformResponse: (response: Result, meta, arg) => {
        return response;
      },
    }),
    getExamaninerFeedback: builder.query({
      query: ({ orgCode, userId, parentId }) => ({
        url: `/aiprompt/evaluate/student-summary?org_code=${orgCode}&student_id=${userId}&parent_id=${parentId}`,
        method: "get",
      }),
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
  useLazyGetStudentPerformanceQuery,
  useLazyGetExamaninerFeedbackQuery,
} = parentApi;
