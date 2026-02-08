import axios, { AxiosInstance } from "axios";
import https from "https";
import { serverEnv } from "../env.server";
// cookie jar utils to build form payloads for Moodle API calls

const LOGIN_SERVICE =
  serverEnv.moodleLoginService?.trim() || "moodle_mobile_app";

// export async function attemptMoodleLogin(username: string, password: string) {
//     const baseUrl = serverEnv.moodleBaseUrl?.replace(/\/$/, "");
//     if (!baseUrl) {
//         throw new Error("Moodle base URL is not configured.");
//     }
//     const loginUrl = `${baseUrl}/login/token.php`;
//     const response = await axios.get(loginUrl, {
//         params: {
//             username,
//             password,
//             service: LOGIN_SERVICE,
//         },
//     });
//     if (response.data?.token) {
//         return response.data;
//     }
//     throw new Error(response.data?.error ?? "Invalid Moodle credentials.");
// }

export async function createMoodleUser(payload: {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
}) {
  const client = getMoodleClient();
  const users = [
    {
      ...payload,
      auth: "manual",
      country: "NG",
      lang: "en",
      timezone: "Africa/Lagos",
    },
  ];

  try {
    const result = await client.call("core_user_create_users", {
      users,
    });

    if (!Array.isArray(result) && result?.exception) {
      throw new Error(result.message || "Unable to create user");
    }

    const created = Array.isArray(result) ? result[0] : null;
    if (!created || !created.id) {
      throw new Error("User creation failed");
    }

    return created;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      throw new Error(
        `Moodle API Request Failed: HTTP ${status} - ${
          typeof data === "string" ? data : JSON.stringify(data)
        }`,
      );
    }
    throw error;
  }
}

function appendFormValue(form: URLSearchParams, key: string, value: unknown) {
  if (value === undefined || value === null) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      appendFormValue(form, `${key}[${index}]`, item),
    );
    return;
  }

  if (typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(
      ([subKey, subValue]) =>
        appendFormValue(form, `${key}[${subKey}]`, subValue),
    );
    return;
  }

  form.append(key, String(value));
}

function buildFormPayload(params: Record<string, any>) {
  const form = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) =>
    appendFormValue(form, key, value),
  );
  return form;
}

/**
 * Moodle API Client
 * Handles all communication with the Moodle REST API
 */
export class MoodleClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private token: string;

  constructor(isLogin: boolean, baseUrl: string, token: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.token = token;
    this.client = axios.create({
      baseURL: `${this.baseUrl}/${isLogin ? "login/token.php" : "webservice/rest/server.php"}`,
      timeout: 30000, // 30 seconds timeout
      withCredentials: true,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Allow self-signed certificates (if needed)
      }),
    });
  }

  /**
   * Call a Moodle web service function
   */
  async call<T = any>(
    wsfunction: string,
    params: Record<string, any> = {},
  ): Promise<T> {
    // Build the form payload with required parameters
    const payload = buildFormPayload({
      wsfunction,
      moodlewsrestformat: "json",
      wstoken: this.token,
      ...params,
    });
    try {
      const response = await this.client.post<T>("", payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Check for Moodle API errors
      if (response.data && typeof response.data === "object") {
        const data = response.data as any;
        if (data.exception || data.error) {
          throw new Error(
            `Moodle API Error: ${data.message || data.error || "Unknown error"}`,
          );
        }
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        // Moodle often returns {exception, errorcode, message, debuginfo}
        console.error("Moodle Axios error:", {
          wsfunction,
          status,
          data,
          axiosMessage: error.message,
          code: error.code,
        });

        throw new Error(
          `Moodle API Request Failed: HTTP ${status} - ${
            typeof data === "string" ? data : JSON.stringify(data)
          }`,
        );
      }
      throw error;
    }
  }

  /**
   * Convenience method for login to get token
   */
  async login(username: string, password: string): Promise<{ token: string }> {
    try {
      const response = await this.client.get<{ token: string }>("", {
        params: {
          username,
          password,
          service: LOGIN_SERVICE,
        },
      });

      if (response.data?.token) {
        return response.data;
      }
      console.error("Moodle login failed: response missing token", {
        status: response.status,
        data: response.data,
        username,
      });
      throw new Error("Invalid credentials.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        console.error("Moodle Login Axios error:", {
          status,
          data,
          axiosMessage: error.message,
          code: error.code,
          username,
        });

        throw new Error(
          `Moodle Login Failed: HTTP ${status} - ${
            typeof data === "string" ? data : JSON.stringify(data)
          }`,
        );
      }
      throw error;
    }
  }

  /**
   * Create a new user
   * core_user_create_users
   */
  async createUser(userData: Record<string, any>): Promise<any> {
    return this.call("core_user_create_users", {
      users: [userData],
    });
  }

  /**
   * Get user information by field
   * core_user_get_users_by_field
   */
  async getUserByField(
    field: "id" | "username" | "email",
    value: string,
  ): Promise<any> {
    return this.call("core_user_get_users_by_field", {
      field,
      values: [value],
    });
  }

  /**
   * Get user information by username (convenience method)
   */
  async getMoodleUserByUsername(username: string): Promise<any> {
    const result = await this.getUserByField("username", username);
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    }
    return null;
  }

  async getMoodleUserByEmail(email: string): Promise<any> {
    const result = await this.getUserByField("email", email);
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    }
    return null;
  }

  /**
   * Get course details by ID
   */
  async getCourseById(courseId: number): Promise<MoodleCourseType | null> {
    const res: any = await this.call("core_course_get_courses_by_field", {
      field: "id",
      value: String(courseId),
    });

    const courses = Array.isArray(res) ? res : res?.courses;
    if (Array.isArray(courses) && courses.length > 0) return courses[0];
    return null;
  }
  /**
   *  Get course Photo (if available)
   */
  async getCoursePhoto(courseId: number): Promise<string | null> {
    const course = await this.getCourseById(courseId);
    if (
      course?.overviewfiles &&
      Array.isArray(course.overviewfiles) &&
      course.overviewfiles.length > 0
    ) {
      return `${course.overviewfiles[0]?.fileurl}&token=${this.token}`;
    }
    return null;
  }

  /**
   * Get user's enrolled courses
   * core_enrol_get_users_courses
   */
  async getUserCourses(userId: number): Promise<MoodleCourseType[]> {
    return this.call("core_enrol_get_users_courses", {
      userid: userId,
    });
  }

  /**
   * Get course contents (sections and modules)
   * core_course_get_contents
   */
  async getCourseContents(courseId: number): Promise<any[]> {
    return this.call("core_course_get_contents", {
      courseid: courseId,
    });
  }

  /**
   * Get user grades for a course
   * gradereport_user_get_grade_items
   */
  async getUserGrades(courseId: number, userId: number): Promise<any> {
    return this.call("gradereport_user_get_grade_items", {
      courseid: courseId,
      userid: userId,
    });
  }

  /**
   * Get recently accessed items
   * block_recentlyaccesseditems_get_recent_items
   */
  async getRecentItems(
    userId: number,
    limit: number = 10,
  ): Promise<MoodleCourseType[]> {
    return this.call("block_recentlyaccesseditems_get_recent_items", {
      userid: userId,
      limit,
    });
  }

  /**
   * Search for courses
   * core_course_search_courses
   */
  async searchCourses(
    searchTerm: string,
    limit: number = 20,
  ): Promise<MoodleCourseType> {
    return this.call("core_course_search_courses", {
      criterianame: "search",
      criteriavalue: searchTerm,
      limittoenrolled: 0,
      limitstart: 0,
      limitnum: limit,
    });
  }

  async searchAllCourses(
    searchTerm: string,
    page = 0,
    perpage = 20,
  ): Promise<any> {
    return this.call("core_course_search_courses", {
      criterianame: "search",
      criteriavalue: searchTerm,
      page,
      perpage,
    });
  }

  /**
   * Get all courses (paginated)
   * core_course_get_courses
   */
  async getCourses(
    offset: number = 0,
    limit: number = 20,
  ): Promise<MoodleCourseType[]> {
    return this.call("core_course_get_courses", {});
  }

  /**
   * Get all courses for public user (paginated)
   * core_course_get_courses
   */
  async getPublicCourses(): Promise<MoodleCourseType[]> {
    return this.call("core_course_get_courses", {});
  }

  /**
   * Get all Categories
   * core_course_get_categories
   */
  async getCategories(): Promise<any[]> {
    return this.call("core_course_get_categories", {});
  }

  /**
   * Get category details by ID
   * core_course_get_category
   */
  async getCategoryById(categoryId: number): Promise<any> {
    return this.call("core_course_get_category", {
      id: categoryId,
    });
  }

  /**
   * Get course sections
   * core_course_get_sections
   */
  async getCourseSections(courseId: number): Promise<any[]> {
    return this.call("core_course_get_sections", {
      courseid: courseId,
    });
  }
}

// Singleton instance
let moodleClient: MoodleClient | null = null;

export function getMoodleClient(): MoodleClient {
  if (!moodleClient) {
    const baseUrl = serverEnv.moodleBaseUrl;
    const token = serverEnv.moodleServiceToken;

    if (!baseUrl || !token) {
      throw new Error(
        "Moodle API credentials not configured. Set MOODLE_BASE_URL and MOODLE_SERVICE_TOKEN environment variables.",
      );
    }

    moodleClient = new MoodleClient(false, baseUrl, token);
  }
  return moodleClient;
}

export function getMoodleClientWithToken(token: string): MoodleClient {
  const baseUrl = serverEnv.moodleBaseUrl;
  if (!baseUrl) throw new Error("Missing MOODLE_BASE_URL");
  if (!token) throw new Error("Missing user moodle token");
  return new MoodleClient(false, baseUrl, token);
}

export function getMoodleLoginClient(): MoodleClient {
  const baseUrl = serverEnv.moodleBaseUrl;
  if (!baseUrl) throw new Error("Missing MOODLE_BASE_URL");
  return new MoodleClient(true, baseUrl, "");
}
