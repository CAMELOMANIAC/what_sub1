import {NextApiRequest, NextApiResponse} from 'next';
import {getTopIngredients} from '../../../../../utils/api/menus';
import {ErrorMessage} from '../../../../../utils/api/errorMessage';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {sandwichMenu} = req.query;
	if (req.method === 'GET') {
		try {
			//top3 조합법 요청시
			if (typeof sandwichMenu === 'string') {
				const results = await getTopIngredients(sandwichMenu, 'bread');

				if (results instanceof Error) {
					throw results;
				} else {
					res.status(200).json(results);
				}
			} else {
				throw new Error(ErrorMessage.NoRequest);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case ErrorMessage.NoResult:
						res.status(204).end();
						break;
					case ErrorMessage.NoRequest:
						res.status(400).end();
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
