import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error) {
    // Check for 401 Unauthorized and trigger logout if needed
    if (result.error.status === 401) {
      // Optionally, you can dispatch a logout action here
      // api.dispatch(logout());
      console.warn("Unauthorized access - consider logging out the user");
    }
  }
  return result;
};

export const coreApi = createApi({
  reducerPath: "coreApi",
  baseQuery,
  tagTypes: ["User", "Users", "Courses", "Categories", "Category"],
  endpoints: (builder) => ({
    getServerHealth: builder.query({
      query: () => "/health",
    }),
  }),
});

export const { useGetServerHealthQuery } = coreApi;
