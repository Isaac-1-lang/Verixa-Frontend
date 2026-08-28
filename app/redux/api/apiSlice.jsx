import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8086'

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { arg }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    const isFormData = typeof FormData !== 'undefined' && arg?.body instanceof FormData;
    if (isFormData) {
      headers.delete('content-type');
    } else if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }
    return headers;
  },
});

// Wrap the base query to catch network-level errors (backend unreachable, CORS, wrong port)
const baseQuery = async (args, api, extraOptions) => {
  try {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result?.error?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.startsWith('/auth/')) {
        window.location.assign('/auth/login?reason=session-expired');
      }
    }
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
