import {NextApiRequest, NextApiResponse} from 'next';
import {
	checkRecipeLike,
	deleteRecipeLike,
	insertRecipeLike,
} from '../../../../utils/api/recipes';
import {checkSession} from '../../../../utils/api/users';
import {ErrorMessage} from '../../../../utils/api/errorMessage';
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {recipeName} = req.query;

	if (req.method === 'POST') {
		try {
			if (!req.headers.cookie || !recipeName) {
				throw new Error(ErrorMessage.NoRequest);
			}
			if (typeof recipeName !== 'string') {
				throw new Error(ErrorMessage.NoRequest);
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
				throw new Error(ErrorMessage.UpdateError);
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
					case ErrorMessage.UpdateError:
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
	} else if (req.method === 'DELETE') {
		try {
			if (!req.headers.cookie || !recipeName) {
				throw new Error(ErrorMessage.NoRequest);
			}
			if (typeof recipeName !== 'string') {
				throw new Error(ErrorMessage.NoRequest);
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
				throw new Error(ErrorMessage.UpdateError);
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
					case ErrorMessage.UpdateError:
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
		// 그 외의 HTTP 메서드 처리
		res.status(405).end();
	}
};

export default handler;
