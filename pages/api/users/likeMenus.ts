import { NextApiRequest, NextApiResponse } from 'next'
import { getMenuLike } from '../../../utils/api/menus';
import { checkSession } from '../../../utils/api/users';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    //이 엔드포인트는 유저가 좋아요를 한 메뉴 정보를 반환함
    if (req.method === 'GET') {
        try {
            if (req.headers.cookie) {
                const userId = await checkSession(req.headers.cookie);
                console.log(userId)
                console.log(typeof userId === 'string')

                if (typeof userId === 'string') {
                    const results = await getMenuLike(userId)

                    if (results instanceof Error) {
                        throw results;
                    } else {
                        res.status(200).json(results)
                    }

                } else {
                    throw new Error('잘못된 요청값 입니다.')
                }
            } else {
                throw new Error('쿠키 정보가 없습니다.')
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                switch (err.message) {
                    case '적합한 결과가 없음':
                        res.status(204).end(); break;
                    case '잘못된 요청값 입니다.':
                        res.status(400).json({ message: err.message }); break;
                    case '쿠키 정보가 없습니다.':
                        res.status(400).json({ message: err.message }); break;
                    default:
                        res.status(500).json({ message: err.message }); break;
                }
            }
        }

    } else {
        // 그 외의 HTTP 메서드 처리
        res.status(405).send({ message: '허용되지 않은 요청 메서드입니다' });
    }

}

export default handler