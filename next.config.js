/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  env: {
    'MYSQL_HOST': '127.0.0.1',
    
    //'MYSQL_HOST': '20.214.217.161',
    'MYSQL_PORT': '3306',
    'MYSQL_DATABASE': 'whatsub',
    'MYSQL_USER': 'root',
    'MYSQL_PASSWORD': '1234',

    'KAKAO_CLIENT_SECRET': 'aEuOy5Dj6HILcuDDfnyRXxbvzm1gMdWL',
    'KAKAO_RESTAPI_KEY': 'f417de962e4f7161ae761a86c4653cd2',
    'URL': "http://localhost:3000",
  },
};
module.exports = nextConfig