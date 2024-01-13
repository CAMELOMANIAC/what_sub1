import { NextApiRequest, NextApiResponse } from 'next'
import { checkUser, updateSession } from '../../../utils/api/users';

//비즈니스 로직은 함수로 만들어서 처리합니다.(함수는 utils/api/ 타입은 interfaces/api에 정의되어 있습니다)
//서비스 로직은 이곳의 핸들러 함수내에서 작성합니다


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    //이 엔드포인트는 로그인을 처리합니다
    if (req.method === 'POST') {
        const id = req.body.id;
        const pwd = req.body.pwd;

        try {
            const userId = await checkUser(id, pwd);

            if (typeof userId === 'string') {
                const sessionId = await updateSession(userId);
                console.log('세션', sessionId);
                res.setHeader('Set-Cookie', [
                    `session=${sessionId}; Path=/; HttpOnly; SameSite=Lax`,
                    `user=${userId}; Path=/; SameSite=Lax`
                ]);
                res.status(200).json({ userId: userId })
            } else {
                throw new Error('잘못된 요청값 입니다.');
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                switch (err.message) {
                    case '일치하는 행이 없거나 이미 수정되어 수정할 수 없음':
                        res.status(204).end(); break;
                    case '잘못된 요청값 입니다.':
                        res.status(400).json({ message: err.message }); break;
                    default:
                        res.status(500).json({ message: err.message }); break;
                }
            }
        }

    } else {
        res.status(405).send({ message: '허용되지 않은 메서드입니다' });
    }
}


export default handler