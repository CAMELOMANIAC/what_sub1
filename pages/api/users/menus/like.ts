import {NextApiRequest, NextApiResponse} from 'next';
import {getMenuLike} from '../../../../utils/api/menus';
import {checkSession} from '../../../../utils/api/users';
import ErrorMessage from '../../../../utils/api/errorMessage';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	//이 엔드포인트는 유저가 좋아요를 한 메뉴 정보를 반환함
	if (req.method === 'GET') {
		try {
			if (req.headers.cookie) {
				const userId = await checkSession(req.headers.cookie);

				if (typeof userId === 'string') {
					const results = await getMenuLike(userId);

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
