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
};
