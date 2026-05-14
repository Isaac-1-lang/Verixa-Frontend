import apiSlice from './apiSlice'

/**
 * Dashboard API Integration
 * Backend endpoints: /api/dashboard
 */
export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // GET /api/dashboard/analytics - Get dashboard statistics
    getDashboardAnalytics: builder.query({
      query: () => '/api/dashboard/analytics',
      providesTags: ['Analytics']
    }),

    // GET /api/dashboard/profile - Get current user profile
    getCurrentUserProfile: builder.query({
      query: () => '/api/dashboard/profile',
      providesTags: ['User']
    })
  }),
  overrideExisting: true
})

export const {
  useGetDashboardAnalyticsQuery,
  useGetCurrentUserProfileQuery
} = dashboardApi
