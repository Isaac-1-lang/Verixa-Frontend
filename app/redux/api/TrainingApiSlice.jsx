import apiSlice from './apiSlice';

const params = (values) => new URLSearchParams(Object.entries(values).filter(([,value]) => value !== undefined && value !== null && value !== '').map(([key,value]) => [key,String(value)])).toString();
const training = (path) => `/api/training${path}`;

export const trainingApi = apiSlice.injectEndpoints({
 endpoints: builder => ({
  getMe: builder.query({ query:()=>'/api/me', providesTags:['User'] }),
  getTrainingOverview: builder.query({ query:({organizationId})=>training(`/overview?${params({organizationId})}`), providesTags:['Training'] }),
  getTrainingPrograms: builder.query({ query:(args)=>training(`/programs?${params(args)}`), providesTags:[{type:'Training',id:'PROGRAMS'}] }),
  getTrainingProgram: builder.query({ query:(id)=>training(`/programs/${id}`), providesTags:(r,e,id)=>[{type:'Training',id:`PROGRAM-${id}`}] }),
  createTrainingProgram: builder.mutation({ query:body=>({url:training('/programs'),method:'POST',body}), invalidatesTags:['Training'] }),
  updateTrainingProgram: builder.mutation({ query:({id,...body})=>({url:training(`/programs/${id}`),method:'PUT',body}), invalidatesTags:['Training'] }),
  archiveTrainingProgram: builder.mutation({ query:id=>({url:training(`/programs/${id}`),method:'DELETE'}), invalidatesTags:['Training'] }),
  getTrainingParticipants: builder.query({ query:(args)=>training(`/participants?${params(args)}`), providesTags:[{type:'Training',id:'PARTICIPANTS'}] }),
  getTrainingParticipant: builder.query({ query:id=>training(`/participants/${id}`), providesTags:(r,e,id)=>[{type:'Training',id:`PARTICIPANT-${id}`}] }),
  createTrainingParticipant: builder.mutation({ query:body=>({url:training('/participants'),method:'POST',body}), invalidatesTags:['Training'] }),
  getTrainingGroups: builder.query({ query:(args)=>training(`/groups?${params(args)}`), providesTags:[{type:'Training',id:'GROUPS'}] }),
  createTrainingGroup: builder.mutation({ query:body=>({url:training('/groups'),method:'POST',body}), invalidatesTags:['Training'] }),
  getProgramModules: builder.query({ query:id=>training(`/programs/${id}/modules`), providesTags:['Training'] }),
  createProgramModule: builder.mutation({ query:({programId,...body})=>({url:training(`/programs/${programId}/modules`),method:'POST',body}), invalidatesTags:['Training'] }),
  getProgramMembers: builder.query({ query:({programId,...args})=>training(`/programs/${programId}/members?${params(args)}`), providesTags:['Training'] }),
  addProgramMember: builder.mutation({ query:({programId,...body})=>({url:training(`/programs/${programId}/members`),method:'POST',body}), invalidatesTags:['Training'] }),
  bulkAddProgramMembers: builder.mutation({ query:({programId,...body})=>({url:training(`/programs/${programId}/members/bulk`),method:'POST',body}), invalidatesTags:['Training'] }),
  getTrainingSessions: builder.query({ query:({programId,...args})=>training(`/sessions?${params({programId,...args})}`), providesTags:[{type:'Training',id:'SESSIONS'}] }),
  getTrainingSession: builder.query({ query:id=>training(`/sessions/${id}`), providesTags:(r,e,id)=>[{type:'Training',id:`SESSION-${id}`}] }),
  createTrainingSession: builder.mutation({ query:body=>({url:training('/sessions'),method:'POST',body}), invalidatesTags:['Training'] }),
  createFollowUpSession: builder.mutation({ query:({programId,...body})=>({url:training(`/programs/${programId}/follow-up-sessions`),method:'POST',body}), invalidatesTags:['Training'] }),
  assignSessionParticipants: builder.mutation({ query:({sessionId,...body})=>({url:training(`/sessions/${sessionId}/participants/bulk`),method:'POST',body}), invalidatesTags:['Training'] }),
  recordSessionAttendance: builder.mutation({ query:({sessionId,...body})=>({url:training(`/sessions/${sessionId}/attendance/bulk`),method:'PUT',body}), invalidatesTags:['Training'] }),
  recordModuleCompletion: builder.mutation({ query:({moduleId,...body})=>({url:training(`/modules/${moduleId}/completion`),method:'PUT',body}), invalidatesTags:['Training'] }),
  getProgramAssessments: builder.query({ query:id=>training(`/programs/${id}/assessments`), providesTags:['Training'] }),
  createTrainingAssessment: builder.mutation({ query:body=>({url:training('/assessments'),method:'POST',body}), invalidatesTags:['Training'] }),
  getProgramIssues: builder.query({ query:id=>training(`/programs/${id}/issues`), providesTags:['Training'] }),
  createTrainingIssue: builder.mutation({ query:body=>({url:training('/issues'),method:'POST',body}), invalidatesTags:['Training'] }),
  updateTrainingIssue: builder.mutation({ query:({id,...body})=>({url:training(`/issues/${id}`),method:'PUT',body}), invalidatesTags:['Training'] }),
  getProgramFeedback: builder.query({ query:id=>training(`/programs/${id}/feedback`), providesTags:['Training'] }),
  createTrainingFeedback: builder.mutation({ query:body=>({url:training('/feedback'),method:'POST',body}), invalidatesTags:['Training'] }),
  getProgramReadiness: builder.query({ query:id=>training(`/programs/${id}/readiness`), providesTags:['Training'] }),
  getProgramNeedsAttention: builder.query({ query:id=>training(`/programs/${id}/needs-attention`), providesTags:['Training'] }),
  getProgramTrainingReport: builder.query({ query:id=>training(`/programs/${id}/report`), providesTags:['Training'] }),
 }), overrideExisting:true,
});

export const { useGetMeQuery,useGetTrainingOverviewQuery,useGetTrainingProgramsQuery,useGetTrainingProgramQuery,useCreateTrainingProgramMutation,useUpdateTrainingProgramMutation,useArchiveTrainingProgramMutation,useGetTrainingParticipantsQuery,useGetTrainingParticipantQuery,useCreateTrainingParticipantMutation,useGetTrainingGroupsQuery,useCreateTrainingGroupMutation,useGetProgramModulesQuery,useCreateProgramModuleMutation,useGetProgramMembersQuery,useAddProgramMemberMutation,useBulkAddProgramMembersMutation,useGetTrainingSessionsQuery,useGetTrainingSessionQuery,useCreateTrainingSessionMutation,useCreateFollowUpSessionMutation,useAssignSessionParticipantsMutation,useRecordSessionAttendanceMutation,useRecordModuleCompletionMutation,useGetProgramAssessmentsQuery,useCreateTrainingAssessmentMutation,useGetProgramIssuesQuery,useCreateTrainingIssueMutation,useUpdateTrainingIssueMutation,useGetProgramFeedbackQuery,useCreateTrainingFeedbackMutation,useGetProgramReadinessQuery,useGetProgramNeedsAttentionQuery,useGetProgramTrainingReportQuery } = trainingApi;
