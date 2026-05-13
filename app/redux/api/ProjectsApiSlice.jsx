import apiSlice from './apiSlice'

/**
 * Project Management API Integration
 * Backend endpoints: /api/projects
 * 
 * Note: Backend only has POST and GET by ID.
 * For listing projects, we'll need to fetch by project IDs or implement a workaround.
 */
export const projectsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // POST /api/projects - Create project
    createProject: builder.mutation({
      query: (projectData) => ({ 
        url: '/api/projects', 
        method: 'POST', 
        body: projectData 
      }),
      invalidatesTags: ['Projects']
    }),
    
    // GET /api/projects/{id} - Get project by ID
    getProjectById: builder.query({
      query: (id) => `/api/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Projects', id }]
    })
  }),
  overrideExisting: false,
})

export const {
  useCreateProjectMutation,
  useGetProjectByIdQuery
} = projectsApi
