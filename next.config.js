// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	compiler: {
		styledComponents: true,
	},
	env: {
		URL: 'http://localhost:3000',
		KAKAO_CLIENT_SECRET: 'aEuOy5Dj6HILcuDDfnyRXxbvzm1gMdWL',
		KAKAO_RESTAPI_KEY: 'f417de962e4f7161ae761a86c4653cd2',
	},
	i18n: {
		locales: ['ko'],
		defaultLocale: 'ko',
	},
};

module.exports = withBundleAnalyzer(nextConfig);
