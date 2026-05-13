import apiSlice from './apiSlice'

/**
 * Execution Queue & Assignment API Integration
 * Backend endpoints: /api/queue
 */
export const queueApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // POST /api/queue/runs/{runId}/assign/round-robin - Auto-assign executions
    assignRoundRobin: builder.mutation({
      query: ({ runId, testerIds }) => ({
        url: `/api/queue/runs/${runId}/assign/round-robin`,
        method: 'POST',
        body: { testerIds }
      }),
      invalidatesTags: ['Queue', 'Executions']
    }),

    // POST /api/queue/runs/{runId}/claim-next - Claim next execution
    claimNextExecution: builder.mutation({
      query: (runId) => ({
        url: `/api/queue/runs/${runId}/claim-next`,
        method: 'POST'
      }),
      invalidatesTags: ['Queue', 'Executions']
    }),

    // POST /api/queue/executions/{executionId}/claim - Claim specific execution
    claimExecution: builder.mutation({
      query: (executionId) => ({
        url: `/api/queue/executions/${executionId}/claim`,
        method: 'POST'
      }),
      invalidatesTags: ['Queue', 'Executions']
    }),

    // POST /api/queue/executions/{executionId}/release - Release execution
    releaseExecution: builder.mutation({
      query: (executionId) => ({
        url: `/api/queue/executions/${executionId}/release`,
        method: 'POST'
      }),
      invalidatesTags: ['Queue', 'Executions']
    }),

    // GET /api/queue/runs/{runId} - Queue view with pagination
    getQueueByRun: builder.query({
      query: ({ runId, page = 0, size = 50 }) => ({
        url: `/api/queue/runs/${runId}`,
        params: { page, size }
      }),
      providesTags: ['Queue']
    })
  }),
  overrideExisting: true
})

export const {
  useAssignRoundRobinMutation,
  useClaimNextExecutionMutation,
  useClaimExecutionMutation,
  useReleaseExecutionMutation,
  useGetQueueByRunQuery
} = queueApi
