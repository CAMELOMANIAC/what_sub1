import { NextApiRequest, NextApiResponse } from 'next'
import { checkSession } from '../../../utils/api/users';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    //이 엔드포인트는 유저 세션을 체크해서 반환만함
    if (req.method === 'GET') {
        try {
            if (req.headers.cookie) {
                const userId = await checkSession(req.headers.cookie);

                res.status(200).json(userId)
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