import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8086'

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }
    return headers;
  },
});

// Wrap the base query to catch network-level errors (backend unreachable, CORS, wrong port)
const baseQuery = async (args, api, extraOptions) => {
  try {
    const result = await rawBaseQuery(args, api, extraOptions);
    // RTK Query returns { error } for HTTP errors — surface them as-is
    return result;
  } catch (err) {
    // This catches fetch() throwing entirely (network failure, CORS block, DNS fail)
    return {
      error: {
        status: 'NETWORK_ERROR',
        error: err?.message || 'Cannot connect to server. Please check the backend is running.',
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'User', 
    'Projects', 
    'TestCases', 
    'Requirements', 
    'Runs', 
    'Executions', 
    'Defects', 
    'Attachments',
    'SignOffs',
    'Queue',
    'Analytics',
    'Articles', 
    'Article', 
    'ArticleLikes', 
    'ArticleComments', 
    'Comments', 
    'Favorites', 
    'Messages', 
    'Notifications'
  ],
  endpoints: builder => ({

  })
})

export default apiSlice;
