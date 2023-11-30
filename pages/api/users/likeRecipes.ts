import { NextApiRequest, NextApiResponse } from 'next';
import { loadRecipeLike } from '../../../utils/api/recipes';
import { checkSession } from '../../../utils/api/users';
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'GET') {
        //사용자가한 레시피 좋아요 정보 읽어오기
        try {
            if (req.headers.cookie) {
                const userId = await checkSession(req.headers.cookie);

                if (typeof userId === 'string') {
                    const results = await loadRecipeLike(userId);

                    if (results instanceof Error) {
                        throw results;
                    } else {
                        res.status(200).json(results)
                    }

                } else {
                    throw new Error('잘못된 요청값입니다')
                }
            } else {
                throw new Error('쿠키 정보가 없습니다')
            }

        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }

    } else {
        // 그 외의 HTTP 메서드 처리
        res.status(405).send({ message: '허용되지 않은 요청 메서드입니다' });
    }

}



export default handler