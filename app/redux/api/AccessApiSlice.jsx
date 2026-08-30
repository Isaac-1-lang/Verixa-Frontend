import apiSlice from './apiSlice';

export const accessApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationMembers: builder.query({
      query: (organizationId) => `/api/organizations/${organizationId}/members`,
      providesTags: (result, error, organizationId) => [{ type: 'User', id: `ORG-${organizationId}-MEMBERS` }],
    }),
    inviteOrganizationMember: builder.mutation({
      query: ({ organizationId, email, role }) => ({
        url: `/api/organizations/${organizationId}/invitations`,
        method: 'POST',
        body: { email, role },
      }),
      invalidatesTags: (result, error, { organizationId }) => [{ type: 'User', id: `ORG-${organizationId}-MEMBERS` }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetOrganizationMembersQuery,
  useInviteOrganizationMemberMutation,
} = accessApi;
