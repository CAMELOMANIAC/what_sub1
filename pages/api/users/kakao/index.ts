import {NextApiRequest, NextApiResponse} from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {code} = req.query; //카카오에서 받은 1차 인증 코드
	const register = req.query.register; //클라이언트 라우트로 리다이렉트할 주소

	if (req.method === 'GET') {
		try {
			let fetchURI;
			if (register !== undefined && register === '1') {
				fetchURI = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=http://localhost:3000/api/users/kakao?register=1&code=${code}&client_secret=${process.env.KAKAO_CLIENT_SECRET}`;
			} else {
				fetchURI = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=http://localhost:3000/api/users/kakao&code=${code}&client_secret=${process.env.KAKAO_CLIENT_SECRET}`;
			}
			const response = await fetch(fetchURI, {
				method: 'POST',
				headers: {
					'Content-Type':
						'application/x-www-form-urlencoded;charset=utf-8',
				},
			});
			const data = await response.json();

			const response2 = await fetch(`https://kapi.kakao.com/v2/user/me`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${data.access_token}`,
					'Content-Type':
						'application/x-www-form-urlencoded;charset=utf-8',
				},
			});

			const data2 = await response2.json();
			// 쿠키 설정
			res.setHeader(
				'Set-Cookie',
				`kakaoCode=${data2.id}; Path=/; SameSite=Lax`,
			);

			// 응답 보내기
			if (register) {
				res.writeHead(302, {Location: '/Register'}).end();
			} else {
				res.writeHead(302, {Location: '/'}).end();
			}
		} catch (error) {
			res.status(500).json({message: '서버 에러'});
		}
	} else {
		res.status(405).end();
	}
};

export default handler;
