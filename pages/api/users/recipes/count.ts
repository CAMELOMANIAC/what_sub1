import {NextApiRequest, NextApiResponse} from 'next';
import {getRecipeCount} from '../../../../utils/api/recipes';
import {checkSession} from '../../../../utils/api/users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		//사용자가 받은 레시피 좋아요 정보 읽어오기
		try {
			if (req.headers.cookie) {
				const userId = await checkSession(req.headers.cookie);

				if (typeof userId === 'string') {
					const results = await getRecipeCount(userId);

					if (results instanceof Error) {
						throw results;
					} else {
						res.status(200).json(results);
					}
				} else {
					throw new Error('잘못된 요청값 입니다.');
				}
			} else {
				throw new Error('쿠키 정보가 없습니다.');
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case '적합한 결과가 없음':
						res.status(204).end();
						break;
					case '잘못된 요청값 입니다.':
						res.status(400).json({message: err.message});
						break;
					case '쿠키 정보가 없습니다.':
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
		res.status(405).send({message: '허용되지 않은 요청 메서드입니다'});
	}
};

export default handler;
