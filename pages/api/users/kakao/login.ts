import {NextApiRequest, NextApiResponse} from 'next';
import {checkKakaoId, updateSession} from '../../../../utils/api/users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {kakaoCode} = req.query;
	if (req.method === 'GET') {
		try {
			if (!kakaoCode) {
				throw new Error('잘못된 요청값 입니다.');
			}
			if (typeof kakaoCode !== 'string') {
				throw new Error('잘못된 요청값 입니다.');
			}
			const userId = await checkKakaoId(kakaoCode);
			if (userId instanceof Error) {
				throw userId;
			}
			const sessionId = await updateSession(userId);
			if (sessionId instanceof Error) {
				throw sessionId;
			}
			res.setHeader('Set-Cookie', [
				`session=${sessionId}; Path=/; HttpOnly; SameSite=Lax`,
				`user=${userId}; Path=/; SameSite=Lax`,
			]);
			res.status(200).json({userId: userId});
		} catch (err) {
			if (err instanceof Error) {
				switch (err.message) {
					case '적합한 결과가 없음':
						res.status(204).end();
						break;
					case '쿠키 정보가 없습니다.':
						res.status(400).json({message: err.message});
						break;
					case '잘못된 요청값 입니다.':
						res.status(400).json({message: err.message});
						break;
					default:
						res.status(500).json({message: err.message});
						break;
				}
			}
		}
	} else {
		res.status(405).send({message: '허용되지 않은 메서드입니다'});
	}
};

export default handler;
