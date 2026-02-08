import { coreApi } from "./core.api";

export const weatherApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getForcasts: builder.query<any, void>({
      query: () => ({
        url: "weather/forecast",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetForcastsQuery } = weatherApi;
