import { NextApiRequest, NextApiResponse } from 'next'
import { checkMenuLike, countMenuLike, deleteMenuLike, insertMenuLike } from '../../../utils/api/menus';
import { checkSession } from '../../../utils/api/users';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    //이 엔드포인트는 메뉴의 좋아요에 관한 엔드포인트
    if (req.method === 'GET') {
        const menuName = req.query.menuName;

        try {
            //get 요청시 반드시 메뉴이름을 받아와야함
            if (typeof menuName === 'string') {
                const result = await countMenuLike(menuName)

                if (result instanceof Error) {
                    throw result
                } else {
                    res.status(200).json(result);
                }

            } else {
                throw new Error('잘못된 요청값 입니다.')
            }


        } catch (err: unknown) {
            if (err instanceof Error) {
                switch (err.message) {
                    case '적합한 결과가 없음':
                        res.status(204).end(); break;
                    case '잘못된 요청값 입니다.':
                        res.status(400).json({ message: err.message }); break;
                    default:
                        res.status(500).json({ message: err.message }); break;
                }
            }
        }

    } else if (req.method === 'PUT') {
        //메뉴 좋아요 추가
        try {
            const menuName = req.body

            if (req.headers.cookie && menuName) {
                const userId = await checkSession(req.headers.cookie);
                if (typeof userId === 'string') {
                    const checkMenuLikeResult = await checkMenuLike(menuName, userId);
                    if (checkMenuLikeResult === false) {
                        const insertRecipeLikeResult = await insertMenuLike(menuName, userId);

                        if (insertRecipeLikeResult instanceof Error) {
                            throw insertRecipeLikeResult
                        } else {
                            res.status(200).json(insertRecipeLikeResult);
                        }

                    } else if (checkMenuLikeResult === true) {
                        const deleteMenuLikeResult = await deleteMenuLike(menuName, userId);

                        if (deleteMenuLikeResult instanceof Error) {
                            throw deleteMenuLikeResult
                        } else {
                            res.status(200).json(deleteMenuLikeResult);
                        }

                    }
                } else {
                    throw new Error('잘못된 요청값 입니다.')
                }
            } else {
                throw new Error('잘못된 요청값 입니다.')
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                switch (err.message) {
                    case '일치하는 행이 없거나 이미 삭제되어 삭제할 수 없음':
                        res.status(204).end(); break;
                    case '잘못된 요청값 입니다.':
                        res.status(400).json({ message: err.message }); break;
                    default:
                        res.status(500).json({ message: err.message }); break;
                }
            }
        }

    } else if (req.method === 'DELETE') {
        //메뉴 좋아요 제거
        try {
            const menuName = req.body

            if (req.headers.cookie && menuName) {//유저 확인
                const userId = await checkSession(req.headers.cookie);
                if (typeof userId === 'string') {
                    const checkMenuLikeResult = await checkMenuLike(menuName, userId);
                    if (checkMenuLikeResult === false) {
                        const deleteMenuLikeResult = await deleteMenuLike(menuName, userId);

                        if (deleteMenuLikeResult instanceof Error) {
                            throw deleteMenuLikeResult
                        } else {
                            res.status(200).json(deleteMenuLikeResult);
                        }

                    } else {
                        throw new Error('이미 좋아요한 메뉴입니다.')
                    }
                } else {
                    throw new Error('잘못된 요청값 입니다.')
                }
            } else {
                throw new Error('잘못된 요청값 입니다.')
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                switch (err.message) {
                    case '일치하는 행이 없거나 이미 삭제되어 삭제할 수 없음':
                        res.status(204).end(); break;
                    case '이미 좋아요한 메뉴입니다.':
                        res.status(204).end(); break;
                    case '잘못된 요청값 입니다.':
                        res.status(400).json({ message: err.message }); break;
                    default:
                        res.status(500).json({ message: err.message }); break;
                }
            }
        }

    } else {
        res.status(405).send({ message: '허용되지 않은 메서드' });
    }
}

export default handler