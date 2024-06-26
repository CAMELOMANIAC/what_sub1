import Document, {Head, Html, Main, NextScript} from 'next/document';
import {ServerStyleSheet} from 'styled-components';

//styled-components 사용하기 위해 추가한 코드
//styled-components는 기본적으로 클라이언트에서 동작하기 때문에
//이 코드는 서버에서 js로 작성된 css를 미리 변환해서 클라이언트에 즉시 적용하도록 함

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: App => props =>
						sheet.collectStyles(<App {...props} />),
				});

			const initialProps = await Document.getInitialProps(ctx);

			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				),
			};
		} finally {
			sheet.seal();
		}
	}
	render() {
		return (
			<Html>
				<Head>
					<link rel="manifest" href="/manifest.json" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
