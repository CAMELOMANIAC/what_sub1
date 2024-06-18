import {NextApiRequest, NextApiResponse} from 'next';
import {checkSession} from '../../../utils/api/users';
import ErrorMessage from '../../../utils/api/errorMessage';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	//이 엔드포인트는 유저 세션을 체크해서 반환만함
	if (req.method === 'GET') {
		try {
			if (req.headers.cookie) {
				const userId = await checkSession(req.headers.cookie);
				if (userId instanceof Error) {
					throw userId;
				}

				res.status(200).json(userId);
			} else {
				throw new Error(ErrorMessage.NoCookie);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case '적합한 결과가 없음':
						res.status(204).end();
						break;
					case '쿠키 정보가 없습니다.':
						res.status(400).end();
						break;
					default:
						res.status(500).json({message: err.message});
						break;
				}
			}
		}
	} else {
		// 그 외의 HTTP 메서드 처리
		res.status(405).end();
	}
};

export default handler;
