import apiSlice from './apiSlice'

/**
 * Test Execution API Integration
 * Backend endpoints: /api/executions
 */
export const executionApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // POST /api/executions - Create/update execution with step results
    saveExecution: builder.mutation({
      query: (execution) => ({
        url: '/api/executions',
        method: 'POST',
        body: execution
      }),
      invalidatesTags: ['Executions', 'Runs']
    }),

    // GET /api/executions/{id} - Get execution by id
    getExecutionById: builder.query({
      query: (id) => `/api/executions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Executions', id }]
    }),

    // GET /api/executions/run/{runId} - List executions for a run
    getExecutionsByRun: builder.query({
      query: (runId) => `/api/executions/run/${runId}`,
      providesTags: (result) => 
        result && Array.isArray(result)
          ? [...result.filter(item => item && item.id).map(({ id }) => ({ type: 'Executions', id })), 'Executions']
          : ['Executions']
    }),

    // GET /api/executions/run/{runId}/search - Search executions with filters
    searchExecutions: builder.query({
      query: ({ runId, result, assigneeId, assignmentStatus, page = 0, size = 20 }) => ({
        url: `/api/executions/run/${runId}/search`,
        params: { result, assigneeId, assignmentStatus, page, size }
      }),
      providesTags: ['Executions']
    }),

    // GET /api/executions/run/{runId}/queue - Queue view (UNASSIGNED/ASSIGNED)
    getExecutionQueue: builder.query({
      query: ({ runId, page = 0, size = 20 }) => ({
        url: `/api/executions/run/${runId}/queue`,
        params: { page, size }
      }),
      providesTags: ['Executions', 'Queue']
    })
  }),
  overrideExisting: true
})

export const {
  useSaveExecutionMutation,
  useGetExecutionByIdQuery,
  useGetExecutionsByRunQuery,
  useSearchExecutionsQuery,
  useGetExecutionQueueQuery
} = executionApi
