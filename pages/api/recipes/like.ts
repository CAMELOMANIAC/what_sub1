import { NextApiRequest, NextApiResponse } from 'next';
import { checkRecipeLike, deleteRecipeLike, insertRecipeLike } from '../../../utils/api/recipes';
import { checkSession } from '../../../utils/api/users';
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'PUT') {
        //레시피 좋아요(좋아요 여부 체크후 추가 또는 제거)
        try {
            const recipeId = Number(req.body)

            if (req.headers.cookie && recipeId) {
                const userId = await checkSession(req.headers.cookie);
                if (typeof userId === 'string') {
                    const checkRecipeLikeResult = await checkRecipeLike(recipeId, userId);

                    if (checkRecipeLikeResult === false) {
                        const insertRecipeLikeResult = await insertRecipeLike(recipeId, userId);

                        if (insertRecipeLikeResult instanceof Error) {
                            throw insertRecipeLikeResult
                        } else {
                            res.status(200).json({message:'좋아요 등록 성공'});
                        }

                    } else if (checkRecipeLikeResult === true) {
                        const deleteRecipeLikeResult = await deleteRecipeLike(recipeId, userId);

                        if (deleteRecipeLikeResult instanceof Error) {
                            throw deleteRecipeLikeResult
                        } else {
                            res.status(200).json({message:'좋아요 제거 성공'});
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
                res.status(500).json({ statusCode: 500, message: err.message });
            }
        }

    } else {
        // 그 외의 HTTP 메서드 처리
        res.status(405).send({ message: '허용되지 않은 요청 메서드입니다' });
    }

}



export default handler