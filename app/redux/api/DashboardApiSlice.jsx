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
    }),
    updateProfile: builder.mutation({
      query: (body) => ({ url: '/api/dashboard/profile', method: 'PUT', body }),
      invalidatesTags: ['User']
    }),
    changePassword: builder.mutation({
      query: (body) => ({ url: '/api/dashboard/profile/password', method: 'POST', body })
    }),
    updatePreferences: builder.mutation({
      query: (body) => ({ url: '/api/dashboard/profile/preferences', method: 'PUT', body }),
      invalidatesTags: ['User']
    }),
    updateAvatar: builder.mutation({
      query: (file) => {
        const body = new FormData();
        body.append('file', file);
        return { url: '/api/dashboard/profile/avatar', method: 'POST', body };
      },
      invalidatesTags: ['User']
    })
  }),
  overrideExisting: true
})

export const {
  useGetDashboardAnalyticsQuery,
  useGetCurrentUserProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUpdatePreferencesMutation,
  useUpdateAvatarMutation
} = dashboardApi
