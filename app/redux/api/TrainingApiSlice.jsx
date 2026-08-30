import apiSlice from './apiSlice';

export const trainingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({ query: () => '/api/me', providesTags: ['User'] }),
    getTrainingPrograms: builder.query({ query: ({ organizationId, page = 0, size = 20 }) => '/api/training/programs?organizationId=' + organizationId + '&page=' + page + '&size=' + size, providesTags: ['Training'] }),
    getTrainingSessions: builder.query({ query: ({ organizationId, page = 0, size = 20 }) => '/api/training/sessions?organizationId=' + organizationId + '&page=' + page + '&size=' + size, providesTags: ['Training'] }),
    getTrainingParticipants: builder.query({ query: ({ organizationId, page = 0, size = 20 }) => '/api/training/participants?organizationId=' + organizationId + '&page=' + page + '&size=' + size, providesTags: ['Training'] }),
    getTrainingReports: builder.query({ query: ({ organizationId, page = 0, size = 10 }) => '/api/training/reports?organizationId=' + organizationId + '&page=' + page + '&size=' + size, providesTags: ['Training'] }),
    getTrainingSection: builder.query({ query: ({ section, organizationId, page = 0, size = 100 }) => `/api/training/${section}?organizationId=${organizationId}&page=${page}&size=${size}`, providesTags: (result, error, { section }) => [{ type: 'Training', id: section }] }),
    createTrainingRecord: builder.mutation({ query: ({ section, ...body }) => ({ url: `/api/training/${section}`, method: 'POST', body }), invalidatesTags: (result, error, { section }) => [{ type: 'Training', id: section }, 'Training'] }),
    updateTrainingRecord: builder.mutation({ query: ({ section, id, ...body }) => ({ url: `/api/training/${section}/${id}`, method: 'PUT', body }), invalidatesTags: (result, error, { section }) => [{ type: 'Training', id: section }, 'Training'] }),
    archiveTrainingRecord: builder.mutation({ query: ({ section, id }) => ({ url: `/api/training/${section}/${id}`, method: 'DELETE' }), invalidatesTags: (result, error, { section }) => [{ type: 'Training', id: section }, 'Training'] }),
  }),
  overrideExisting: true,
});
export const { useGetMeQuery, useGetTrainingProgramsQuery, useGetTrainingSessionsQuery, useGetTrainingParticipantsQuery, useGetTrainingReportsQuery, useGetTrainingSectionQuery, useCreateTrainingRecordMutation, useUpdateTrainingRecordMutation, useArchiveTrainingRecordMutation } = trainingApi;
