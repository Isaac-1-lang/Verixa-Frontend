import apiSlice from './apiSlice'

const AUTH_URL = '/api/auth';

export const userApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: `${AUTH_URL}/login`,
        method: 'POST',
        body: credentials
      })
    }),
    // Note: Registration endpoint not in OpenAPI spec yet
    // This is a placeholder - update when backend adds registration
    register: builder.mutation({
      query: user => ({
        url: `${AUTH_URL}/register`,
        method: 'POST',
        body: user
      })
    }),
    getProfile: builder.query({
      query: () => ({ url: `/api/users/me` }),
      providesTags: ['User']
    })
  }),
  overrideExisting: false
})

export const { useLoginMutation, useRegisterMutation, useGetProfileQuery } = userApi
