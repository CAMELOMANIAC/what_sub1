import {NextApiRequest, NextApiResponse} from 'next';
import {getRecipesFromRecipeId} from '../../../utils/api/recipes';
import {recipeType} from '../../../interfaces/api/recipes';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	let {limit} = req.query;
	let {offset} = req.query;
	let {sort} = req.query;
	const {recipeId} = req.query;

	//이 엔드포인트는 모든 레시피 정보를 반환합니다
	if (req.method === 'GET') {
		//모든 레시피 정보 가져오기
		try {
			let recipeIdArray: number[] = [];
			if (!(recipeId instanceof Array || typeof recipeId === 'string')) {
				throw new Error('잘못된 요청값 입니다.');
			} else if (typeof recipeId === 'string') {
				recipeIdArray = [Number(recipeId)];
			} else if (recipeId instanceof Array) {
				recipeIdArray = recipeId.map(id => Number(id));
			}

			if (typeof limit === 'undefined') {
				limit = '9';
			}
			if (typeof offset === 'undefined') {
				offset = '0';
			}
			if (typeof sort !== 'string') {
				sort = 'like_count';
			}

			const results: recipeType[] | Error = await getRecipesFromRecipeId({
				recipeIdArray,
				offset: Number(offset),
				limit: Number(limit),
				sort,
			});

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
		res.status(405).send({message: '허용되지 않은 메서드'});
	}
};

export default handler;
