/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  env: {
    'URL': "http://localhost:3000",
    KAKAO_CLIENT_SECRET:"aEuOy5Dj6HILcuDDfnyRXxbvzm1gMdWL",
    KAKAO_RESTAPI_KEY:"f417de962e4f7161ae761a86c4653cd2"
  },
};
module.exports = nextConfig