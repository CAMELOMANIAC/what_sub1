import {NextApiRequest, NextApiResponse} from 'next';
import {getTotalMenuInfo} from '../../../utils/api/menus';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		try {
			const results = await getTotalMenuInfo();

			if (results instanceof Error) {
				throw results;
			} else {
				res.status(200).json(results);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case '적합한 결과가 없음':
						res.status(204).end();
						break;
					default:
						res.status(500).json({message: err.message});
						break;
				}
			}
		}
	} else {
		// 그 외의 HTTP 메서드 처리
		res.status(405).send({message: 'Method Not Allowed'});
	}
};

export default handler;
