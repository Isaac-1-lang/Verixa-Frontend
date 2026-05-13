import apiSlice from './apiSlice'

const AUTH_URL = '/api/auth';

export const userApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // POST /api/auth/login - Login and receive JWT
    login: builder.mutation({
      query: credentials => ({
        url: `${AUTH_URL}/login`,
        method: 'POST',
        body: credentials
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.accessToken) {
            localStorage.setItem('token', data.accessToken)
          }
        } catch (err) {
          // Error handled by component
        }
      }
    }),
    
    // POST /api/auth/register - Register new user
    register: builder.mutation({
      query: user => ({
        url: `${AUTH_URL}/register`,
        method: 'POST',
        body: user
      })
    }),
    
    // GET /api/users/me - Get current user profile
    getProfile: builder.query({
      query: () => '/api/users/me',
      providesTags: ['User']
    })
  }),
  overrideExisting: false
})

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetProfileQuery 
} = userApi
