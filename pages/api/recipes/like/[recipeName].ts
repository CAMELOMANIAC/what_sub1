import {NextApiRequest, NextApiResponse} from 'next';
import {
	checkRecipeLike,
	deleteRecipeLike,
	insertRecipeLike,
} from '../../../../utils/api/recipes';
import {checkSession} from '../../../../utils/api/users';
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {recipeName} = req.query;

	if (req.method === 'POST') {
		try {
			if (!req.headers.cookie || !recipeName) {
				throw new Error('잘못된 요청값 입니다.');
			}
			if (typeof recipeName !== 'string') {
				throw new Error('잘못된 요청값 입니다.');
			}

			const userId = await checkSession(req.headers.cookie);
			if (userId instanceof Error) {
				throw userId;
			}

			const checkMenuLikeResult = await checkRecipeLike(
				Number(recipeName),
				userId,
			);
			if (checkMenuLikeResult === true) {
				throw new Error('이미 좋아요한 레시피 입니다.');
			}
			if (checkMenuLikeResult instanceof Error) {
				throw checkMenuLikeResult;
			}

			const insertRecipeLikeResult = await insertRecipeLike(
				Number(recipeName),
				userId,
			);
			if (insertRecipeLikeResult instanceof Error) {
				throw insertRecipeLikeResult;
			}

			res.status(200).end();
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case '일치하는 행이 없거나 이미 삭제되어 삭제할 수 없음':
						res.status(204).end();
						break;
					case '이미 좋아요한 레시피 입니다.':
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
	} else if (req.method === 'DELETE') {
		try {
			if (!req.headers.cookie || !recipeName) {
				throw new Error('잘못된 요청값 입니다.');
			}
			if (typeof recipeName !== 'string') {
				throw new Error('잘못된 요청값 입니다.');
			}

			const userId = await checkSession(req.headers.cookie);
			if (userId instanceof Error) {
				throw userId;
			}

			const checkMenuLikeResult = await checkRecipeLike(
				Number(recipeName),
				userId,
			);
			if (checkMenuLikeResult === false) {
				throw new Error('이미 좋아요 제거한 레시피 입니다.');
			}
			if (checkMenuLikeResult instanceof Error) {
				throw checkMenuLikeResult;
			}

			const insertRecipeLikeResult = await deleteRecipeLike(
				Number(recipeName),
				userId,
			);
			if (insertRecipeLikeResult instanceof Error) {
				throw insertRecipeLikeResult;
			}

			res.status(200).end();
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case '일치하는 행이 없거나 이미 삭제되어 삭제할 수 없음':
						res.status(204).end();
						break;
					case '이미 좋아요 제거한 레시피 입니다.':
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
		// 그 외의 HTTP 메서드 처리
		res.status(405).send({message: '허용되지 않은 요청 메서드입니다'});
	}
};

export default handler;
