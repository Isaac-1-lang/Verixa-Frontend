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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.accessToken) {
            localStorage.setItem('token', data.accessToken)
            
            // Fetch user profile after successful login
            try {
              const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8086'}/api/dashboard/profile`, {
                headers: {
                  'Authorization': `Bearer ${data.accessToken}`,
                  'Content-Type': 'application/json'
                }
              })
              if (profileResponse.ok) {
                const profile = await profileResponse.json()
                localStorage.setItem('user', JSON.stringify(profile))
              }
            } catch (profileErr) {
              console.error('Failed to fetch user profile:', profileErr)
            }
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
  overrideExisting: true
})

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetProfileQuery 
} = userApi
