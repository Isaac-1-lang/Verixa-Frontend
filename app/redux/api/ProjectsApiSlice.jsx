import apiSlice from './apiSlice'

/**
 * Project Management API Integration
 * Backend endpoints: /api/projects
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
    }),

    // GET /api/projects - List all projects
    listAllProjects: builder.query({
      query: () => '/api/projects',
      providesTags: ['Projects']
    })
  }),
  overrideExisting: true,
})

export const {
  useCreateProjectMutation,
  useGetProjectByIdQuery,
  useListAllProjectsQuery
} = projectsApi
