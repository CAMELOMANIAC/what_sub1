import {NextApiRequest, NextApiResponse} from 'next';
import {
	insertRecipe,
	getRecipes,
	getRecipesFromRecipeId,
	getRecipesFromUserId,
} from '../../../utils/api/recipes';
import {filterType, recipeType} from '../../../interfaces/api/recipes';
import {checkSession} from '../../../utils/api/users';
import ErrorMessage from '../../../utils/api/errorMessage';

//레시피 이름으로 검색하기
const handleQuery = async (query, req, res) => {
	let {filter, limit, offset, sort} = req.query;
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
				filterType.menuName,
				filterType.recipeName,
				filterType.writer,
				filterType.ingredients,
				filterType.tag,
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
};

//레시피 아이디로 검색하기
const handleRecipeId = async (recipeId, req, res) => {
	let {limit, offset, sort} = req.query;
	let recipeIdArray: number[] = [];
	if (!(recipeId instanceof Array || typeof recipeId === 'string')) {
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
};
//유저 아이디로 검색하기
const handleUserId = async (userId, req, res) => {
	let {limit, offset, sort} = req.query;
	if (!userId) {
		throw new Error(ErrorMessage.NoRequest);
	} else if (typeof userId !== 'string') {
		throw new Error(ErrorMessage.NoRequest);
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

	const results: recipeType[] | Error = await getRecipesFromUserId({
		userId,
		offset: Number(offset),
		limit: Number(limit),
		sort,
	});

	if (results instanceof Error) {
		throw results;
	} else {
		res.status(200).json(results);
	}
};

//모든 레시피 정보 가져오기
const handleAllRecipes = async (req, res) => {
	let {limit, offset, sort} = req.query;
	const filter = [filterType.menuName, filterType.recipeName, filterType.writer, filterType.ingredients, filterType.tag];
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
};

const handlers = {
	query: handleQuery,
	recipeId: handleRecipeId,
	userId: handleUserId,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	//이 엔드포인트는 레시피에 관한 api입니다
	if (req.method === 'GET') {
		try {
			for (const key in handlers) {
				if (req.query[key]) {
					//req매개변수는 query, recipeId, userId 객체를 반환, 하나라도 존재하면 해당 핸들러를 실행
					await handlers[key](req.query[key], req, res); //3개 함수의 매개변수가 모두 같으므로 가능
					break;
				}
			}
			if (!req.query.query) {
				await handleAllRecipes(req, res);
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
						res.status(400).json({message: err.message});
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
