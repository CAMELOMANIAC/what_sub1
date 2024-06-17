import {NextApiRequest, NextApiResponse} from 'next';
import {getRecipeLike} from '../../../../../utils/api/recipes';
import {checkSession} from '../../../../../utils/api/users';
import {ErrorMessage} from '../../../../../utils/api/errorMessage';
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		//사용자가한 레시피 좋아요 정보 읽어오기
		try {
			if (req.headers.cookie) {
				const userId = await checkSession(req.headers.cookie);

				if (typeof userId === 'string') {
					const results = await getRecipeLike(userId);

					if (results instanceof Error) {
						throw results;
					} else {
						res.status(200).json(results);
					}
				} else {
					throw new Error(ErrorMessage.NoRequest);
				}
			} else {
				throw new Error(ErrorMessage.NoCookie);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case ErrorMessage.NoResult:
						res.status(204).end();
						break;
					case ErrorMessage.NoRequest:
						res.status(400).json({message: err.message});
						break;
					case ErrorMessage.NoCookie:
						res.status(400).json({message: err.message});
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
