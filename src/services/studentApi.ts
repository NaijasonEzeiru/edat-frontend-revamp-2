import getConfig from "next/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import addDefaulHeaders from "../utils/authHeader";

const { publicRuntimeConfig } = getConfig();

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

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${publicRuntimeConfig.backendApi}`,
    prepareHeaders: (headers, { getState }) => {
      const _authHeader = addDefaulHeaders(headers);
      return _authHeader;
    },
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getStudentList: builder.query({
      query: ({ orgCode, userId }) => ({
        url: `/users/list/${orgCode}/${userId}?licence_type=student`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
    }),
    getStudentListByClass: builder.query({
      query: ({ orgCode, classId, userId }) => ({
        url: `${orgCode}/${userId}/teacher/classroom/list/student/${classId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
    }),
    getStudentProfile: builder.query({
      query: ({ userId, orgCode, role }) => ({
        url: `/users/profile/${role}/${orgCode}?user_id=${userId}&student_id=${userId}`,
        method: "get",
      }),
      providesTags: ["Profile"],
      transformResponse: (response: any, meta, arg) => {
        return response.results.items[0] ?? [];
      },
    }),
    userProfileUpdate: builder.query({
      query: ({ userId, orgCode, data }) => ({
        url: `/users/profile/student/update/${orgCode}?user_id=${userId}&student_id=${userId}`,
        method: "post",
        body: data,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results ?? {};
      },
    }),
    // userProfilePictureUpdate: builder.mutation({
    //   query: ({ userId, orgCode, data, role }) => {
    //     return {
    //       url: `${orgCode}/${userId}/users/profile/${role}/uploadimage`,
    //       method: "post",
    //       body: data,
    //       formData: true,
    //     };
    //   },
    //   invalidatesTags: ["Profile"],
    //   transformResponse: (response: any, meta, arg) => {
    //     return response.results ?? {};
    //   },
    // }),
    getStudentClassRoom: builder.query({
      query: ({ userId, orgCode }) => ({
        url: `${orgCode}/${userId}/student/list/classroom`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
    }),
    getStudentActivityList: builder.query({
      query: ({ userId, classId, orgCode }) => ({
        url: `${orgCode}/${userId}/student/activity/list?class_id=${classId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
    }),
    takeTest: builder.query({
      query: ({ orgCode, data, userId }) => ({
        url: `${orgCode}/${userId}/student/activity/run`,
        method: "post",
        body: data,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? {};
      },
    }),
    // AiTest: builder.query({
    //   query: ({ orgCode, data, userId }) => ({
    //     url: `${orgCode}/${userId}/student/activity/run?org_code=${orgCode}`,
    //     method: "post",
    //     body: data,
    //   }),
    //   transformResponse: (response: any, meta, arg) => {
    //     return response.results.items ?? {};
    //   },
    // }),
    getExamaninersFeedback: builder.query({
      query: ({ orgCode, userId }) => ({
        url: `/aiprompt/evaluate/student-summary?org_code=${orgCode}&student_id=${userId}`,
        method: "get",
      }),
      // transformResponse: (response: any, meta, arg) => {
      //   return response.results.items ?? {};
      // },
    }),
    updateQuestion: builder.mutation<any, any>({
      query: ({ orgCode, request, userId }) => ({
        url: `${orgCode}/${userId}/student/activity/qustion/update`,
        method: "post",
        body: request,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? {};
      },
    }),
    submitQuiz: builder.mutation<any, any>({
      query: ({ orgCode, request, userId }) => ({
        url: `${orgCode}/${userId}/student/activity/submit?user_id=${userId}`,
        method: "post",
        body: request,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response ?? {};
      },
    }),
    getQuizScore: builder.query({
      query: ({ userId, orgCode, request }) => ({
        url: `${orgCode}/${userId}/student/activity/score`,
        method: "post",
        body: request,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items[0] ?? [];
      },
    }),
    getAIQuizScore: builder.query({
      query: ({ userId, orgCode, request }) => ({
        url: `${orgCode}/${userId}/student/aiactivity/score?user_id=13`,
        method: "post",
        body: request,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items[0] ?? [];
      },
    }),
    getSubjectMetrics: builder.query({
      query: ({ userId, orgCode, classId, subjectId, studentId }) => ({
        url: `${orgCode}/${userId}/student/charts/student-score/radar?class_id=${classId}&subject_id=${subjectId}&student_id=${studentId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results ?? [];
      },
    }),
    getAllStudentsPerformance: builder.query({
      query: ({ userId, orgCode }) => ({
        url: `${orgCode}/${userId}/student/report/all-student-performance-report`,
        method: "get",
      }),
      transformResponse: (response: Result, meta, arg) => {
        return response;
      },
    }),
    getAStudentsPerformance: builder.query({
      query: ({ userId, orgCode }) => ({
        url: `${orgCode}/${userId}/student/report/student-performance-report`,
        method: "get",
      }),
      transformResponse: (response: Result, meta, arg) => {
        return response;
      },
    }),
    getRecommendations: builder.query({
      query: ({ userId, orgCode, classId, subjectId, studentId }) => ({
        url: `${orgCode}/${userId}/student/charts/student-recommendation/subject?class_id=${classId}&subject_id=${subjectId}&user_id=${studentId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response;
      },
    }),
    aiPrompt: builder.query({
      query: ({ myPrompt }) => ({
        url: `/aiprompt/myprompt?myprompt=${myPrompt}&level=beginner&subject=science`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response;
      },
    }),
  }),
});

export const {
  useUserProfileUpdateQuery,
  useLazyUserProfileUpdateQuery,
  useGetStudentListQuery,
  useLazyGetStudentListQuery,
  useLazyGetStudentListByClassQuery,
  useGetStudentListByClassQuery,
  useGetStudentClassRoomQuery,
  useLazyGetStudentClassRoomQuery,
  useGetStudentActivityListQuery,
  useLazyGetStudentActivityListQuery,
  useLazyGetStudentProfileQuery,
  useLazyTakeTestQuery,
  useTakeTestQuery,
  useUpdateQuestionMutation,
  useSubmitQuizMutation,
  useLazyGetQuizScoreQuery,
  useLazyAiPromptQuery,
  useLazyGetSubjectMetricsQuery,
  // useGetRecommendationsQuery,
  useLazyGetRecommendationsQuery,
  // useUserProfilePictureUpdateMutation,
  useLazyGetAllStudentsPerformanceQuery,
  useLazyGetAStudentsPerformanceQuery,
  useLazyGetExamaninersFeedbackQuery,
} = studentApi;
