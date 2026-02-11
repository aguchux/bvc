const parseNumberEnv = (value?: string, fallback?: number) => {
  const parsed = typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const serverEnv = {
  moodleBaseUrl:
    process.env.MOODLE_BASE_URL ?? process.env.PUBLIC_MOODLE_BASE_URL ?? "",
  moodleServiceToken:
    process.env.MOODLE_SERVICE_TOKEN ??
    process.env.PUBLIC_MOODLE_SERVICE_TOKEN ??
    "",
  moodleLoginService:
    process.env.MOODLE_LOGIN_SERVICE ??
    process.env.PUBLIC_MOODLE_LOGIN_SERVICE ??
    "moodle_mobile_app",
  moodleUseBrowserBypass: "false",
  moodleStudentRoleId: parseNumberEnv(
    process.env.MOODLE_STUDENT_ROLE_ID ??
      process.env.PUBLIC_MOODLE_STUDENT_ROLE_ID,
    5,
  ),
};
