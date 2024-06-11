import {NextApiRequest, NextApiResponse} from 'next';
import {
	checkMenuLike,
	countMenuLike,
	deleteMenuLike,
	insertMenuLike,
} from '../../../../utils/api/menus';
import {checkSession} from '../../../../utils/api/users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {menuName} = req.query;

	if (req.method === 'GET') {
		//메뉴 좋아요 수 반환
		try {
			if (!menuName) {
				throw new Error('잘못된 요청값 입니다.');
			}
			if (typeof menuName !== 'string') {
				throw new Error('잘못된 요청값 입니다.');
			}

			const result = await countMenuLike(menuName);
			if (result instanceof Error) {
				throw result;
			}

			res.status(200).json(result);
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
	} else if (req.method === 'POST') {
		//메뉴 좋아요 추가
		try {
			if (!req.headers.cookie || !menuName) {
				throw new Error('잘못된 요청값 입니다.');
			}
			if (typeof menuName !== 'string') {
				throw new Error('잘못된 요청값 입니다.');
			}

			const userId = await checkSession(req.headers.cookie);
			if (userId instanceof Error) {
				throw userId;
			}

			const checkMenuLikeResult = await checkMenuLike(menuName, userId);
			if (checkMenuLikeResult === true) {
				throw new Error('이미 좋아요한 메뉴 입니다.');
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
					case '일치하는 행이 없거나 이미 삭제되어 삭제할 수 없음':
						res.status(204).end();
						break;
					case '이미 좋아요한 메뉴 입니다.':
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
		//메뉴 좋아요 제거
		try {
			if (!req.headers.cookie || !menuName) {
				throw new Error('잘못된 요청값 입니다.');
			}
			if (typeof menuName !== 'string') {
				throw new Error('잘못된 요청값 입니다.');
			}

			const userId = await checkSession(req.headers.cookie);
			if (userId instanceof Error) {
				throw userId;
			}

			const checkMenuLikeResult = await checkMenuLike(menuName, userId);
			if (checkMenuLikeResult === false) {
				throw new Error('이미 좋아요 제거한 메뉴 입니다.');
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
					case '일치하는 행이 없거나 이미 삭제되어 삭제할 수 없음':
						res.status(204).end();
						break;
					case '이미 좋아요 제거한 메뉴 입니다.':
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
