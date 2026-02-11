/** @type {import('next').NextConfig} */
const moodleBaseUrl =
  process.env.MOODLE_BASE_URL ?? process.env.PUBLIC_MOODLE_BASE_URL;

const moodleRemotePattern = (() => {
  if (!moodleBaseUrl) return null;
  try {
    const parsed = new URL(moodleBaseUrl);
    return {
      protocol: parsed.protocol.replace(":", ""),
      hostname: parsed.hostname,
      port: "",
      pathname: "/**",
    };
  } catch (error) {
    return null;
  }
})();

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bvc.nmseprep.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        port: "",
        pathname: "/**",
      },
      ...(moodleRemotePattern ? [moodleRemotePattern] : []),
    ],
  },
};

export default nextConfig;
