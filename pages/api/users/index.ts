import {NextApiRequest, NextApiResponse} from 'next';
import {userDataType} from '../../../interfaces/api/users';
import {
	checkSession,
	deleteUserFromUserId,
	deleteUserInfoFromUserId,
	getUsersData,
} from '../../../utils/api/users';
import ErrorMessage from '../../../utils/api/errorMessage';
import {
	deleteAllRecipeIngredients,
	deleteNotUsingRecipeTag,
	deleteAllRecipeReplyFromUserId,
	deleteAllRecipeLikeFromUserId,
	getRecipesFromUserId,
	deleteRecipeFromUserId,
	deleteAllRecipeTag,
} from '../../../utils/api/recipes';
import {deleteMenuLikeFromUserId} from '../../../utils/api/menus';

//비즈니스 로직은 함수로 만들어서 처리합니다.(함수는 utils/api/ 타입은 interfaces/api에 정의되어 있습니다)
//서비스 로직은 이곳의 핸들러 함수내에서 작성합니다

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	//이 엔드포인트는 여러명의 유저정보를 불러옵니다
	if (req.method === 'GET') {
		try {
			const results: userDataType[] | Error = await getUsersData();

			if (results instanceof Error) {
				throw results;
			} else {
				res.status(200).json(results);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case ErrorMessage.NoRequest:
						res.status(400).json({message: err.message});
						break;
					default:
						res.status(500).json({message: err.message});
						break;
				}
			}
		}
	} else if (req.method === 'DELETE') {
		try {
			if (req.headers.cookie) {
				const userId = await checkSession(req.headers.cookie);
				if (!userId || userId instanceof Error) {
					throw new Error(ErrorMessage.NoLogin);
				}
				await deleteMenuLikeFromUserId(userId);
				await deleteAllRecipeLikeFromUserId(userId);
				await deleteAllRecipeReplyFromUserId(userId);
				await deleteNotUsingRecipeTag();
				const recipeArray = await getRecipesFromUserId({
					//유저가 작성한 모든 레시피의 레시피 id를 가져와야함
					userId: userId,
					sort: 'user_table_user_id',
					offset: 0,
					limit: 99999, //모든 레시피를 가져오기 위해 큰 값을 넣어줍니다
				});
				if (recipeArray instanceof Error) {
					throw recipeArray;
				}
				const recipeIdArray = recipeArray.map(item =>
					Number(item.recipe_id),
				);
				await deleteAllRecipeTag(recipeIdArray);
				await deleteAllRecipeIngredients(recipeIdArray);
				await deleteRecipeFromUserId(userId);
				const infoDeleteResult = deleteUserInfoFromUserId(userId);
				if (infoDeleteResult instanceof Error) {
					throw infoDeleteResult;
				}
				const userDeleteResult = deleteUserFromUserId(userId);
				if (userDeleteResult instanceof Error) {
					throw userDeleteResult;
				}
			} else {
				throw new Error(ErrorMessage.NoCookie);
			}

			res.status(200).end();
		} catch (error) {
			if (error instanceof Error) {
				switch (error.message) {
					case ErrorMessage.NoLogin:
						res.status(400).json({message: error.message});
						break;
					case ErrorMessage.NoCookie:
						res.status(400).json({message: error.message});
						break;
					case ErrorMessage.NoRequest:
						res.status(400).json({message: error.message});
						break;
					default:
						res.status(500).json({message: error.message});
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
