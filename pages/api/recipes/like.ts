import { NextApiRequest, NextApiResponse } from 'next';
import { deleteRecipeLike, insertRecipeLike } from '../../../utils/api/recipes';
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'POST') {
        //좋아요 추가
        try {
            const recipe = req.body
            const userId = req.body

            if (typeof recipe === 'string' && typeof userId === 'string') {
                const insertRecipeLikeResult = await insertRecipeLike(recipe, userId);

                if (insertRecipeLikeResult instanceof Error) {
                    throw insertRecipeLikeResult;
                } else {
                    res.status(200).json(insertRecipeLikeResult)
                }

            } else {
                throw new Error('잘못된 요청값입니다')
            }

        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ statusCode: 500, message: err.message });
            }
        }

    } else if (req.method === 'DELETE') {
        //좋아요 제거
        try {
            const recipe = req.body
            const userId = req.body

            if (typeof recipe === 'string' && typeof userId === 'string') {
                const deleteRecipeLikeResult = await deleteRecipeLike(recipe, userId);

                if (deleteRecipeLikeResult instanceof Error) {
                    throw deleteRecipeLikeResult;
                } else {
                    res.status(200).json(deleteRecipeLikeResult)
                }

            } else {
                throw new Error('잘못된 요청값입니다')
            }

        } catch (err) {
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