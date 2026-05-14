import apiSlice from './apiSlice'

/**
 * Requirements API Integration
 * Backend endpoints: /api/requirements
 */
export const requirementApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // POST /api/requirements - Create or update functional requirement
    upsertRequirement: builder.mutation({
      query: (requirement) => ({
        url: '/api/requirements',
        method: 'POST',
        body: requirement
      }),
      invalidatesTags: ['Requirements']
    }),

    // GET /api/requirements/project/{projectId} - List requirements by project
    getRequirementsByProject: builder.query({
      query: (projectId) => `/api/requirements/project/${projectId}`,
      providesTags: (result) => 
        result && Array.isArray(result)
          ? [...result.filter(item => item && item.id).map(({ id }) => ({ type: 'Requirements', id })), 'Requirements']
          : ['Requirements']
    }),

    // GET /api/requirements/project/{projectId}/search - Search with pagination
    searchRequirements: builder.query({
      query: ({ projectId, q, tcNumber, appRef, page = 0, size = 20, sort }) => ({
        url: `/api/requirements/project/${projectId}/search`,
        params: { q, tcNumber, appRef, page, size, sort }
      }),
      providesTags: ['Requirements']
    })
  }),
  overrideExisting: true
})

export const {
  useUpsertRequirementMutation,
  useGetRequirementsByProjectQuery,
  useSearchRequirementsQuery
} = requirementApi
