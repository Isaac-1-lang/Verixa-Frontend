import apiSlice from './apiSlice'

/**
 * Test Case API Integration
 * Backend endpoints: /api/testcases
 */
export const testCaseApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // POST /api/testcases - Create or update test case with steps
    upsertTestCase: builder.mutation({
      query: (testCase) => ({
        url: '/api/testcases',
        method: 'POST',
        body: testCase
      }),
      invalidatesTags: ['TestCases']
    }),

    // GET /api/testcases/project/{projectId} - List test cases by project
    getTestCasesByProject: builder.query({
      query: (projectId) => `/api/testcases/project/${projectId}`,
      providesTags: (result) => 
        result && Array.isArray(result)
          ? [...result.filter(item => item && item.id).map(({ id }) => ({ type: 'TestCases', id })), 'TestCases']
          : ['TestCases']
    }),

    // GET /api/testcases/{id} - Get test case by id
    getTestCaseById: builder.query({
      query: (id) => `/api/testcases/${id}`,
      providesTags: (result, error, id) => [{ type: 'TestCases', id }]
    }),

    // GET /api/testcases/project/{projectId}/search - Search with pagination
    searchTestCases: builder.query({
      query: ({ projectId, q, appRef, frRefCode, page = 0, size = 20, sort }) => ({
        url: `/api/testcases/project/${projectId}/search`,
        params: { q, appRef, frRefCode, page, size, sort }
      }),
      providesTags: ['TestCases']
    })
  }),
  overrideExisting: true
})

export const {
  useUpsertTestCaseMutation,
  useGetTestCasesByProjectQuery,
  useGetTestCaseByIdQuery,
  useSearchTestCasesQuery
} = testCaseApi
