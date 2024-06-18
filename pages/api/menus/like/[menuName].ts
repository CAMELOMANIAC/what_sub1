import {NextApiRequest, NextApiResponse} from 'next';
import {
	checkMenuLike,
	countMenuLike,
	deleteMenuLike,
	insertMenuLike,
} from '../../../../utils/api/menus';
import {checkSession} from '../../../../utils/api/users';
import ErrorMessage from '../../../../utils/api/errorMessage';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {menuName} = req.query;

	if (req.method === 'GET') {
		//메뉴 좋아요 수 반환
		try {
			if (!menuName) {
				throw new Error(ErrorMessage.NoRequest);
			}
			if (typeof menuName !== 'string') {
				throw new Error(ErrorMessage.NoRequest);
			}

			const result = await countMenuLike(menuName);
			if (result instanceof Error) {
				throw result;
			}

			res.status(200).json(result);
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
		//메뉴 좋아요 추가
		try {
			if (!req.headers.cookie || !menuName) {
				throw new Error(ErrorMessage.NoRequest);
			}
			if (typeof menuName !== 'string') {
				throw new Error(ErrorMessage.NoRequest);
			}

			const userId = await checkSession(req.headers.cookie);
			if (userId instanceof Error) {
				throw userId;
			}

			const checkMenuLikeResult = await checkMenuLike(menuName, userId);
			if (checkMenuLikeResult === true) {
				throw new Error(ErrorMessage.UpdateError);
			}
			if (checkMenuLikeResult instanceof Error) {
				throw checkMenuLikeResult;
			}

			const insertRecipeLikeResult = await insertMenuLike(
				menuName,
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
						res.status(400).json({message: err.message});
						break;
					default:
						res.status(500).json({message: err.message});
						break;
				}
			}
		}
	} else if (req.method === 'DELETE') {
		//메뉴 좋아요 제거
		try {
			if (!req.headers.cookie || !menuName) {
				throw new Error(ErrorMessage.NoRequest);
			}
			if (typeof menuName !== 'string') {
				throw new Error(ErrorMessage.NoRequest);
			}

			const userId = await checkSession(req.headers.cookie);
			if (userId instanceof Error) {
				throw userId;
			}

			const checkMenuLikeResult = await checkMenuLike(menuName, userId);
			if (checkMenuLikeResult === false) {
				throw new Error(ErrorMessage.UpdateError);
			}
			if (checkMenuLikeResult instanceof Error) {
				throw checkMenuLikeResult;
			}

			const deleteMenuLikeResult = await deleteMenuLike(menuName, userId);
			if (deleteMenuLikeResult instanceof Error) {
				throw deleteMenuLikeResult;
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
		res.status(405).end();
	}
};

export default handler;
