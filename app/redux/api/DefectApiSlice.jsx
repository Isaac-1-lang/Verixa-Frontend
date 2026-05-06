import apiSlice from './apiSlice'

/**
 * Defect Management API Integration
 * Backend endpoints: /api/defects
 */
export const defectApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // POST /api/defects - Create defect against execution
    createDefect: builder.mutation({
      query: (defect) => ({
        url: '/api/defects',
        method: 'POST',
        body: defect
      }),
      invalidatesTags: ['Defects', 'Executions']
    }),

    // GET /api/defects/execution/{executionId} - List defects for execution
    getDefectsByExecution: builder.query({
      query: (executionId) => `/api/defects/execution/${executionId}`,
      providesTags: (result) => 
        result 
          ? [...result.map(({ id }) => ({ type: 'Defects', id })), 'Defects']
          : ['Defects']
    }),

    // GET /api/defects/run/{runId} - List defects for run
    getDefectsByRun: builder.query({
      query: (runId) => `/api/defects/run/${runId}`,
      providesTags: (result) => 
        result 
          ? [...result.map(({ id }) => ({ type: 'Defects', id })), 'Defects']
          : ['Defects']
    }),

    // PATCH /api/defects/{id}/status - Update defect status
    updateDefectStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/defects/${id}/status`,
        method: 'PATCH',
        params: { status }
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Defects', id }, 'Defects']
    })
  }),
  overrideExisting: false
})

export const {
  useCreateDefectMutation,
  useGetDefectsByExecutionQuery,
  useGetDefectsByRunQuery,
  useUpdateDefectStatusMutation
} = defectApi
