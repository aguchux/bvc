import { coreApi } from "./core.api";

export const authApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthUserResponse, AuthCredentials>({
      query: ({ identifier, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { username: identifier, password },
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),
    register: builder.mutation<AuthUserResponse, RegisterPayload>({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),
    getUserByField: builder.query<{ users: MoodleUserType[] }, UserFieldQuery>({
      query: ({ field, value }) => ({
        url: "/auth/user",
        params: { field, value },
      }),
      providesTags: (result) =>
        result?.users
          ? result.users.map((user) => ({
              type: "Users" as const,
              id: user.id,
            }))
          : [],
    }),
    currentUser: builder.query<
      AuthUserResponse | null,
      {
        moodleToken?: string;
      }
    >({
      query: ({ moodleToken }) => ({
        url: "/auth/me",
        params: moodleToken ? { moodleToken } : undefined,
      }),
      providesTags: (result) =>
        result ? [{ type: "User", id: "CURRENT" }] : [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserByFieldQuery,
  useCurrentUserQuery,
} = authApi;
