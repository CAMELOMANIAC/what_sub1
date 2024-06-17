import {NextApiRequest, NextApiResponse} from 'next';
import {userDataType} from '../../../interfaces/api/users';
import {checkSession, getUsersData} from '../../../utils/api/users';
import {ErrorMessage} from '../../../utils/api/errorMessage';
import {
	deleteAllRecipeReply,
	deleteAllRecipeLike,
	deleteAllRecipeTag,
	deleteAllRecipeIngredients,
	deleteRecipe,
	deleteNotUsingRecipeTag,
	deleteAllRecipeReplyFromUserId,
} from '../../../utils/api/recipes';

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

				await deleteAllRecipeReply(recipeIdArray);
				await deleteAllRecipeLike(recipeIdArray);
				await deleteAllRecipeReplyFromUserId(userId);
				await deleteNotUsingRecipeTag();
				await deleteAllRecipeIngredients(recipeIdArray);

				const deleteRecipeResult = await deleteRecipe(recipeIdArray); //실제 레시피 제거시 실패하면 에러를 던집니다
				if (!deleteRecipeResult) {
					throw new Error(ErrorMessage.DeleteError);
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
