/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  env: {
    'MYSQL_HOST': '127.0.0.1',
    'MYSQL_PORT': '3306',
    'MYSQL_DATABASE': 'whatsub',
    'MYSQL_USER': 'root',
    'MYSQL_PASSWORD': '1234',

    'KAKAO_CLIENT_ID': 'f417de962e4f7161ae761a86c4653cd2',
    'KAKAO_CLIENT_SECRET': '',
  },
};
module.exports = nextConfig;