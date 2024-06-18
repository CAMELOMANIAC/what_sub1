import {NextApiRequest, NextApiResponse} from 'next';
import {getRecommendedMenus} from '../../../utils/api/menus';
import ErrorMessage from '../../../utils/api/errorMessage';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		try {
			const results = await getRecommendedMenus();

			if (results instanceof Error) {
				throw results;
			} else {
				res.status(200).json(results);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case ErrorMessage.NoResult:
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
		res.status(405).end();
	}
};

export default handler;
