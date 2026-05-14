import apiSlice from './apiSlice'

/**
 * Test Run API Integration
 * Backend endpoints: /api/runs
 */
export const testRunApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // POST /api/runs - Create run with auto-populated executions
    createTestRun: builder.mutation({
      query: (run) => ({
        url: '/api/runs',
        method: 'POST',
        body: run
      }),
      invalidatesTags: ['Runs']
    }),

    // PATCH /api/runs/{id}/status - Transition run status
    updateRunStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/runs/${id}/status`,
        method: 'PATCH',
        params: { status }
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Runs', id }, 'Runs']
    }),

    // GET /api/runs/{id} - Get run by ID
    getTestRunById: builder.query({
      query: (id) => `/api/runs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Runs', id }]
    }),

    // GET /api/runs/project/{projectId} - List ALL runs by project (not paginated)
    listTestRunsByProject: builder.query({
      query: (projectId) => `/api/runs/project/${projectId}`,
      providesTags: ['Runs']
    }),

    // GET /api/runs/project/{projectId}/search - Search runs with pagination
    searchTestRuns: builder.query({
      query: ({ projectId, status, page = 0, size = 20 }) => ({
        url: `/api/runs/project/${projectId}/search`,
        params: { status, page, size }
      }),
      providesTags: ['Runs']
    })
  }),
  overrideExisting: true
})

export const {
  useCreateTestRunMutation,
  useUpdateRunStatusMutation,
  useGetTestRunByIdQuery,
  useListTestRunsByProjectQuery,
  useSearchTestRunsQuery
} = testRunApi
