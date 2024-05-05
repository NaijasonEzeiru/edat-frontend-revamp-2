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

export const teacherApi = createApi({
  reducerPath: "teacherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${publicRuntimeConfig.backendApi}`,
    prepareHeaders: (headers, { getState }) => {
      const _authHeader = addDefaulHeaders(headers);
      return _authHeader;
    },
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    addSkill: builder.mutation<any, any>({
      query: (request) => ({
        url: `${request.org_code}/${request.teacher_id}/teacher/profile/skill/add`,
        method: "post",
        body: request,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response;
      },
    }),
    updateSkill: builder.mutation<any, any>({
      query: (request) => ({
        url: `${request.org_code}/${request.teacher_id}/teacher/profile/skill/update`,
        method: "post",
        body: request,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response;
      },
    }),
    deleteSkill: builder.mutation<any, any>({
      query: (request) => ({
        url: `${request.org_code}/${request.teacher_id}/teacher/profile/skill/delete`,
        method: "delete",
        body: request,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response;
      },
    }),
    addStudent: builder.mutation<any, any>({
      query: (request) => ({
        url: `${request.org_code}/${request.user_id}/teacher/classroom/add/student`,
        method: "post",
        body: request,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results ?? [];
      },
    }),
    getSkillSet: builder.query({
      query: ({ userId, orgCode }) => ({
        url: `${orgCode}/${userId}/teacher/profile/skill/list`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
    }),
    getTeacherProfile: builder.query({
      query: ({ userId, orgCode, role }) => ({
        url: `/users/profile/${role}/${orgCode}?user_id=${userId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items[0] ?? [];
      },
    }),
    userProfileUpdate: builder.query({
      query: ({ userId, orgCode, data }) => ({
        url: `/users/profile/teacher/update/${orgCode}?user_id=${userId}`,
        method: "post",
        body: data,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results ?? {};
      },
    }),
    addAITask: builder.query({
      query: ({ userId, orgCode, values, body, classId }) => ({
        url: `/aiprompt/generate_questionset_mistral/${classId}?total_questions=${values.total_questions}&estimated_time=${values.estimated_time}&total_score=${values.total_score}&question_type=${values.question_type}&exam_board=${values.exam_board}&user_country=${values.user_country}&points_per_question=${values.points_per_question}&teacher_id=${userId}&org_code=${orgCode}`,
        method: "POST",
        body,
      }),
      transformResponse: (response: any, meta, arg) => {
        return response ?? {};
      },
    }),
    getClassRoomByTeacher: builder.query({
      query: ({ userId, orgCode }) => ({
        url: `/${orgCode}/${userId}/teacher/list/classroom`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
    }),
    getCategoriesByClassId: builder.query({
      query: ({ orgCode, classId, userId }) => ({
        url: `${orgCode}/${userId}/teacher/subjects/category/list/${classId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
    }),
    getTopicByCategory: builder.query({
      query: ({ orgCode, classId, categoryId, userId }) => ({
        url: `/${orgCode}/${userId}/teacher/subjects/category/topic/list/${classId}?category_id=${categoryId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
    }),
    getSetCodeByTopic: builder.query({
      query: ({ orgCode, classId, topicId, userId }) => ({
        url: `/${orgCode}/${userId}/teacher/subjects/category/topic/setcode/list/${classId}?topic_id=${topicId}&teacher_id=${userId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
    }),
    getClassRoomById: builder.query({
      query: ({ userId, orgCode, classId }) => ({
        url: `/${orgCode}/${userId}/teacher/classroom/list/student/${classId}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.results.items ?? [];
      },
    }),
    // getSetCodeByObjCode: builder.query({
    //   query: ({ objCode }) => ({
    //     url: `/content/list_setcode_by_objcode?obj_code=${objCode}`,
    //     method: "get",
    //   }),
    //   transformResponse: (response: any, meta, arg) => {
    //     return response.results.items ?? [];
    //   },
    // }),
    globalSearch: builder.query({
      query: ({ text }) => ({
        url: `content/objectsearch?text_filter=${text}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response ?? [];
      },
    }),
    setCodeSearch: builder.query({
      query: ({ objCode }) => ({
        url: `/content/list_setcode_by_objcode?obj_code=${objCode}`,
        method: "get",
      }),
      transformResponse: (response: any, meta, arg) => {
        return response ?? [];
      },
    }),
    getAllStudentsPerf: builder.query({
      query: ({ userId, orgCode, teacherId }) => ({
        url: `${orgCode}/${userId}/student/report/all-student-performance-report?teacher_id=${teacherId}`,
        method: "get",
      }),
      transformResponse: (response: Result, meta, arg) => {
        return response;
      },
    }),
    getStudentPerf: builder.query({
      query: ({ userId, orgCode, teacherId }) => ({
        url: `${orgCode}/${userId}/student/report/student-performance-report?teacher_id=${teacherId}`,
        method: "get",
      }),
      transformResponse: (response: Result, meta, arg) => {
        return response;
      },
    }),
    addTask: builder.mutation<any, any>({
      query: (request) => {
        console.log(request);
        const {
          activity_name,
          description,
          recommendation,
          set_code,
          // study_materials,
        } = request.body;
        const formData = new FormData();
        formData.append("activity_name", activity_name);
        formData.append("description", description);
        formData.append("recommendation", recommendation);
        formData.append("set_code", set_code);
        // formData.append("study_materials", study_materials);
        return {
          // url: `${request.orgCode}/${request.userId}/teacher/classroom/assign_activity/${request.classId}?org_code=${request.orgCode}`,
          url: `/classroom/assign_activity/${request.classId}?org_code=${request.orgCode}&user_id=${request.userId}&teacher_id=${request.userId}`,
          method: "post",
          body: request.body,
        };
      },
      transformResponse: (response: any, meta, arg) => {
        return response;
      },
    }),
  }),
});

export const {
  useAddSkillMutation,
  useGetTeacherProfileQuery,
  useLazyGetTeacherProfileQuery,
  useGetClassRoomByTeacherQuery,
  useLazyGetClassRoomByTeacherQuery,
  useGetSkillSetQuery,
  useLazyGetSkillSetQuery,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useAddStudentMutation,
  useLazyUserProfileUpdateQuery,
  useGetCategoriesByClassIdQuery,
  useLazyGetCategoriesByClassIdQuery,
  useGetTopicByCategoryQuery,
  useLazyGetTopicByCategoryQuery,
  useGetSetCodeByTopicQuery,
  useLazyGetSetCodeByTopicQuery,
  useLazyGetClassRoomByIdQuery,
  useAddTaskMutation,
  // useLazyGetSetCodeByObjCodeQuery,
  // useUserProfileImageUpdateMutation,
  useLazyGetAllStudentsPerfQuery,
  useLazyGetStudentPerfQuery,
  useLazyAddAITaskQuery,
  useLazyGlobalSearchQuery,
  useLazySetCodeSearchQuery,
} = teacherApi;
