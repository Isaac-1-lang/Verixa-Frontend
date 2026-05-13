import apiSlice from './apiSlice'

/**
 * Attachment Management API Integration
 * Backend endpoints: /api/attachments
 */
export const attachmentApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // POST /api/attachments/upload - Upload attachment
    uploadAttachment: builder.mutation({
      query: ({ file, ownerType, ownerId }) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('ownerType', ownerType)
        formData.append('ownerId', ownerId)
        
        return {
          url: '/api/attachments/upload',
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, let browser set it with boundary
          prepareHeaders: (headers) => {
            headers.delete('content-type')
            return headers
          }
        }
      },
      invalidatesTags: ['Attachments']
    }),

    // GET /api/attachments/owner - List attachments by owner
    getAttachmentsByOwner: builder.query({
      query: ({ ownerType, ownerId }) => ({
        url: '/api/attachments/owner',
        params: { ownerType, ownerId }
      }),
      providesTags: (result) => 
        result 
          ? [...result.map(({ id }) => ({ type: 'Attachments', id })), 'Attachments']
          : ['Attachments']
    }),

    // GET /api/attachments/{id}/download - Download attachment
    downloadAttachment: builder.query({
      query: (id) => ({
        url: `/api/attachments/${id}/download`,
        responseHandler: (response) => response.blob()
      })
    })
  }),
  overrideExisting: false
})

export const {
  useUploadAttachmentMutation,
  useGetAttachmentsByOwnerQuery,
  useLazyDownloadAttachmentQuery
} = attachmentApi
