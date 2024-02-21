/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  env: {
    //'MYSQL_HOST': '127.0.0.1',
    'MYSQL_HOST':'whatsub-mysql-db.mysql.database.azure.com',
    //'MYSQL_HOST': 'whatsub-db.fefvdedbfjaeg6hr.koreacentral.azurecontainer.io',
    'MYSQL_PORT': '3306',
    'MYSQL_DATABASE': 'whatsub',
    'MYSQL_USER': 'root',
    'MYSQL_PASSWORD': '1234',
    
    'MAIL_ID': 'yugyusang12@gmail.com',
    'MAIL_PASSWORD': 'panc qwaz auiw klsd',

    'KAKAO_CLIENT_SECRET': 'aEuOy5Dj6HILcuDDfnyRXxbvzm1gMdWL',
    'KAKAO_RESTAPI_KEY': 'f417de962e4f7161ae761a86c4653cd2',
    'URL': "http://localhost:3000",
  },
};
module.exports = nextConfig