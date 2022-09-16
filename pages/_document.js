import NextDocument, { Html, Head, Main, NextScript } from "next/document";
export default class Document extends NextDocument {
	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="preload" href="/fonts/DrukCond.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
