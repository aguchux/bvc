import { coreApi } from "./core.api";

export type CourseSummary = {
  id: number;
  fullname: string;
  shortname: string;
  summary?: string;
  summaryformat?: number | null;
  categoryName?: string | null;
  moodleCourseId?: number;
};

export type CourseDetail = {
  course: MoodleCourseType;
  photoUrl: string | null;
  contents: any[];
};

export type CourseListParams = {
  limit?: number;
  offset?: number;
};

export type CourseListMeta = {
  offset: number;
  limit: number;
  count: number;
};

export type MoodleCategoryType = {
  id: number;
  name: string;
  description?: string;
  descriptionformat?: number;
  visible?: number;
  parent?: number | null;
  sortorder?: number;
};

export type CategoryListResponse = {
  categories: MoodleCategoryType[];
  meta: CourseListMeta;
};

export const courseApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategories: builder.query<CategoryListResponse, CourseListParams | void>({
      query: (params) => ({
        url: "/categories",
        params: {
          limit: params?.limit,
          offset: params?.offset,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.categories.map(({ id }) => ({ type: "Categories" as const, id })),
              { type: "Categories", id: "LIST" },
            ]
          : [{ type: "Categories", id: "LIST" }],
    }),
    getCategoryById: builder.query<any, number>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
      }),
      providesTags: (result, error, categoryId) => [
        { type: "Categories", id: categoryId },
      ],
    }),
    listCourses: builder.query<MoodleCoursesResponse, CourseListParams | void>({
      query: (params) => ({
        url: "/courses",
        params: {
          limit: params?.limit,
          offset: params?.offset,
        },
      }),
      providesTags: (result) =>
        result
          ? [{ type: "Courses", id: "LIST" }]
          : [{ type: "Courses", id: "LIST" }],
    }),
    getCourseById: builder.query<CourseDetail, number>({
      query: (courseId) => ({
        url: `/courses/${courseId}`,
      }),
      providesTags: (result, error, courseId) => [
        { type: "Courses", id: courseId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListCategoriesQuery,
  useGetCategoryByIdQuery,
  useListCoursesQuery,
  useGetCourseByIdQuery,
} = courseApi;
