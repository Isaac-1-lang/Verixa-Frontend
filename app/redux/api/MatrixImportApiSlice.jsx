import apiSlice from './apiSlice'

export const matrixImportApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // POST /api/matrix/import/{projectId} - Import matrix from DOCX/XLSX
    importMatrix: builder.mutation({
      query: ({ projectId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        
        return {
          url: `/api/matrix/import/${projectId}`,
          method: 'POST',
          body: formData,
          formData: true
        }
      },
      invalidatesTags: ['TestCases', 'Requirements']
    })
  }),
  overrideExisting: true
})

export const {
  useImportMatrixMutation
} = matrixImportApi
