import {NextApiRequest, NextApiResponse} from 'next';
import {getRecipeTag, getTag} from '../../../utils/api/tag';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		const sandwichMenu = req.query.param;
		const tagQuery = req.query.tag;

		try {
			if (typeof sandwichMenu === 'string') {
				//레시피 이름으로 검색시
				const result = await getRecipeTag(sandwichMenu);

				if (result instanceof Error) {
					throw result;
				} else {
					res.status(200).json(result);
				}
			} else if (typeof tagQuery === 'string') {
				//태그 이름으로 검색시
				const result = await getTag(tagQuery);

				if (result instanceof Error) {
					throw result;
				} else {
					res.status(200).json(result);
				}
			} else {
				throw new Error('잘못된 요청값 입니다.');
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
					default:
						res.status(500).json({message: err.message});
						break;
				}
			}
		}
	} else {
		res.status(405).send({message: '허용되지 않은 메서드'});
	}
};

export default handler;
