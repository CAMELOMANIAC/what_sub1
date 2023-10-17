/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  env: {
    'MYSQL_HOST': '127.0.0.1',
    'MYSQL_PORT': '3306',
    'MYSQL_DATABASE': 
      'mydb',
    'MYSQL_USER': 
      'root',
    'MYSQL_PASSWORD': 
      '1234',
  }
};
module.exports = nextConfig;