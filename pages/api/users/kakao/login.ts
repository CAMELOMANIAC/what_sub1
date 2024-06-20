import {NextApiRequest, NextApiResponse} from 'next';
import {checkKakaoId, updateSession} from '../../../../utils/api/users';
import ErrorMessage from '../../../../utils/api/errorMessage';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {kakaoCode} = req.query;
	if (req.method === 'GET') {
		try {
			if (!kakaoCode) {
				throw new Error(ErrorMessage.NoRequest);
			}
			if (typeof kakaoCode !== 'string') {
				throw new Error(ErrorMessage.NoRequest);
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
					case ErrorMessage.NoResult:
						res.status(204).end();
						break;
					case ErrorMessage.NoCookie:
						res.status(400).json({message: err.message});
						break;
					case ErrorMessage.NoRequest:
						res.status(400).json({message: err.message});
						break;
					default:
						res.status(500).json({message: err.message});
						break;
				}
			}
		}
	} else {
		res.status(405).end();
	}
};

export default handler;
