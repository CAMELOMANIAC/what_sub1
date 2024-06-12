import {NextApiRequest, NextApiResponse} from 'next';
import {
	insertRecipe,
	getRecipes,
	deleteAllRecipeReply,
	deleteAllRecipeLike,
	deleteAllRecipeTag,
	deleteAllRecipeIngredients,
	deleteRecipe,
} from '../../../utils/api/recipes';
import {recipeType} from '../../../interfaces/api/recipes';
import {checkSession} from '../../../utils/api/users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	let {limit} = req.query;
	let {offset} = req.query;
	let {sort} = req.query;

	//이 엔드포인트는 모든 레시피 정보를 반환합니다
	if (req.method === 'GET') {
		//모든 레시피 정보 가져오기
		try {
			const filter = ['메뉴이름', '레시피제목', '작성자', '재료', '태그'];
			//offset,limit는 옵셔널 쿼리문자열이므로 추가적 처리가 필요
			if (typeof limit === 'undefined') {
				limit = '9';
			}
			if (typeof offset === 'undefined') {
				offset = '0';
			}
			if (typeof sort != 'string') {
				sort = 'like_count';
			}

			const results: recipeType[] | Error = await getRecipes({
				searchQuery: ' ',
				offset: Number(offset),
				limit: Number(limit),
				filter,
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
	} else if (req.method === 'POST') {
		//레시피 추가하기
		try {
			if (req.headers.cookie) {
				const userId = await checkSession(req.headers.cookie);

				if (typeof userId === 'string') {
					const recipe = req.body;
					const insertRecipeResult = await insertRecipe(
						userId,
						recipe,
					);

					if (insertRecipeResult instanceof Error) {
						throw insertRecipeResult;
					} else {
						res.status(200).json({message: '성공'});
					}
				}
			} else {
				throw new Error('쿠키 정보가 없습니다.');
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case '쿠키 정보가 없습니다.':
						res.status(204).end();
						break;
					case '일치하는 행이 없거나 이미 수정되어 수정할 수 없음':
						res.status(400).json({message: err.message});
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
	} //레시피 제거시 레시피에 해당하는 레시피 댓글, 레시피 좋아요, 레시피 태그, 레시피 재료를 모두 제거합니다
	else if (req.method === 'DELETE') {
		const recipeId = req.body.recipeId;
		try {
			if (req.headers.cookie) {
				const userId = await checkSession(req.headers.cookie);
				if (!userId || userId instanceof Error) {
					throw new Error('로그인이 필요합니다.');
				}
			} else {
				throw new Error('쿠키 정보가 없습니다.');
			}

			let recipeIdArray: number[] = [];
			if (!(recipeId instanceof Array || typeof recipeId === 'number')) {
				throw new Error('잘못된 요청값 입니다.');
			} else if (typeof recipeId === 'number') {
				recipeIdArray = [Number(recipeId)];
			} else if (recipeId instanceof Array) {
				recipeIdArray = recipeId.map(id => Number(id));
			}

			await deleteAllRecipeReply(recipeIdArray);
			await deleteAllRecipeLike(recipeIdArray);
			await deleteAllRecipeTag(recipeIdArray);
			await deleteAllRecipeIngredients(recipeIdArray);
			await deleteRecipe(recipeIdArray);

			res.status(200).end();
		} catch (error) {
			if (error instanceof Error) {
				switch (error.message) {
					case '로그인이 필요합니다.':
						res.status(400).json({message: error.message});
						break;
					case '쿠키 정보가 없습니다.':
						res.status(400).json({message: error.message});
						break;
					case '잘못된 요청값 입니다.':
						res.status(400).json({message: error.message});
						break;
					default:
						res.status(500).json({message: error.message});
						break;
				}
			}
		}
	} else {
		res.status(405).send({message: '허용되지 않은 메서드'});
	}
};

export default handler;
