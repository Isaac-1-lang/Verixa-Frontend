import apiSlice from './apiSlice'

/**
 * Defect Management API Integration
 * Backend endpoints: /api/defects
 */
export const defectApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // POST /api/defects - Create defect against an execution
    // Body: { executionId, title, severity, status, description, reproductionSteps }
    createDefect: builder.mutation({
      query: (defect) => ({
        url: '/api/defects',
        method: 'POST',
        body: defect
      }),
      invalidatesTags: ['Defects', 'Executions']
    }),

    // PATCH /api/defects/{id}/status - Update defect status
    updateDefectStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/defects/${id}/status`,
        method: 'PATCH',
        params: { status }
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Defects', id }, 'Defects']
    }),

    // GET /api/defects/run/{runId} - List all defects for a run
    getDefectsByRun: builder.query({
      query: (runId) => `/api/defects/run/${runId}`,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [...result.filter(d => d?.id).map(({ id }) => ({ type: 'Defects', id })), 'Defects']
          : ['Defects']
    }),

    // GET /api/defects/execution/{executionId} - List defects for an execution
    getDefectsByExecution: builder.query({
      query: (executionId) => `/api/defects/execution/${executionId}`,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [...result.filter(d => d?.id).map(({ id }) => ({ type: 'Defects', id })), 'Defects']
          : ['Defects']
    })
  }),
  overrideExisting: true
})

export const {
  useCreateDefectMutation,
  useUpdateDefectStatusMutation,
  useGetDefectsByRunQuery,
  useGetDefectsByExecutionQuery
} = defectApi
