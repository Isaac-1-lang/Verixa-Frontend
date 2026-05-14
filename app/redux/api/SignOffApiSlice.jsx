import apiSlice from './apiSlice'

/**
 * Run Sign-off API Integration
 * Backend endpoints: /api/signoff
 */
export const signOffApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // POST /api/signoff - Sign off a run (approve/reject)
    signOffRun: builder.mutation({
      query: (signOff) => ({
        url: '/api/signoff',
        method: 'POST',
        body: signOff
      }),
      invalidatesTags: ['SignOffs', 'Runs']
    }),

    // GET /api/signoff/run/{runId} - Get latest sign-off for run
    getLatestSignOff: builder.query({
      query: (runId) => `/api/signoff/run/${runId}`,
      providesTags: (result, error, runId) => [{ type: 'SignOffs', id: runId }]
    })
  }),
  overrideExisting: true
})

export const {
  useSignOffRunMutation,
  useGetLatestSignOffQuery
} = signOffApi
