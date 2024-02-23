/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  env: {
    // 'MYSQL_USER': 'root',
    // 'MYSQL_PASSWORD': '1234',
    //'MYSQL_HOST': 'whatsub-db.fefvdedbfjaeg6hr.koreacentral.azurecontainer.io',
    //'MYSQL_HOST': '127.0.0.1',
    //'MYSQL_PORT': '3306',
    //'MYSQL_DATABASE': 'whatsub',
    'URL': "http://localhost:3000",
  },
};
module.exports = nextConfig