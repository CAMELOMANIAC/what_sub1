import {NextApiRequest, NextApiResponse} from 'next';
import ErrorMessage from '../../../../utils/api/errorMessage';
import {getMenuAddIngredients} from '../../../../utils/api/menus';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		try {
			//menu페이지에서 재료추가 정보 불러오기
			const results = await getMenuAddIngredients();

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
		res.status(405).end();
	}
};

export default handler;
