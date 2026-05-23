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
          const { data } = await queryFulfilled;
          if (data?.accessToken) {
            localStorage.setItem('token', data.accessToken);

            // Fetch and cache user profile right after login
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8086'}/api/dashboard/profile`,
                { headers: { Authorization: `Bearer ${data.accessToken}` } }
              );
              if (res.ok) {
                const profile = await res.json();
                localStorage.setItem('user', JSON.stringify(profile));
              }
            } catch (_) {
              // Profile fetch failure should not block login
            }
          }
        } catch (_) {
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
  }),
  overrideExisting: true
})

export const {
  useLoginMutation,
  useRegisterMutation,
} = userApi
