import {NextApiRequest, NextApiResponse} from 'next';
import {
	insertRecipe,
	getRecipes,
	getRecipesFromRecipeId,
} from '../../../utils/api/recipes';
import {recipeType} from '../../../interfaces/api/recipes';
import {checkSession} from '../../../utils/api/users';
import {ErrorMessage} from '../../../utils/api/errorMessage';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {query} = req.query;
	const {recipeId} = req.query;
	let {filter} = req.query;
	let {limit} = req.query;
	let {offset} = req.query;
	let {sort} = req.query;

	//이 엔드포인트는 레시피에 관한 api입니다
	if (req.method === 'GET') {
		try {
			if (query) {
				//레시피 이름으로 검색하기
				if (typeof query === 'string') {
					//offset,limit,filter는 옵셔널 쿼리문자열이므로 추가적 처리가 필요
					if (typeof limit === 'undefined') {
						limit = '3';
					}
					if (typeof offset === 'undefined') {
						offset = '0';
					}
					if (typeof filter === 'string') {
						filter = [filter];
					} else if (typeof filter === 'undefined') {
						filter = [
							'메뉴이름',
							'레시피제목',
							'작성자',
							'재료',
							'태그',
						];
					}
					if (typeof sort != 'string') {
						sort = 'recipe_id';
					}

					const results: recipeType[] | Error = await getRecipes({
						searchQuery: query,
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
				} else if (query instanceof Array) {
					throw new Error(ErrorMessage.NoRequest);
				}
			} else if (recipeId) {
				//레시피 아이디로 검색하기
				let recipeIdArray: number[] = [];
				if (
					!(recipeId instanceof Array || typeof recipeId === 'string')
				) {
					throw new Error(ErrorMessage.NoRequest);
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

				const results: recipeType[] | Error =
					await getRecipesFromRecipeId({
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
			} else {
				//모든 레시피 정보 가져오기
				const filter = [
					'메뉴이름',
					'레시피제목',
					'작성자',
					'재료',
					'태그',
				];
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
						res.status(200).end();
					}
				}
			} else {
				throw new Error(ErrorMessage.NoCookie);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case ErrorMessage.NoCookie:
						res.status(204).end();
						break;
					case ErrorMessage.UpdateError:
						res.status(400).json({message: err.message});
						break;
					case ErrorMessage.NoRequest:
						res.status(400).json({message: err.message});
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
