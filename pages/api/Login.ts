import { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../lib/db'
import { v4 as uuidv4 } from 'uuid';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
    } else if (req.method === 'POST') {
        try {
            const id = req.body.id;
            const pwd = req.body.pwd;
            const results = await executeQuery({ query: 'SELECT user_id, user_pwd FROM user_table WHERE user_id = ? AND user_pwd = ?', values: [id, pwd] });

            if (!Array.isArray(results)) {
                throw new Error('쿼리가 잘못 작성됨')
            } else if (results.length <= 0) {
                throw new Error('적당한 결과가 없음')
            } else {
                try {
                    const sessionId = uuidv4();
                    const results2 = await executeQuery({ query: 'UPDATE user_table SET user_session = ? WHERE user_id = ?', values: [sessionId, results[0].user_id] });
                    if (results2.affectedRows === 0) {
                        throw new Error('업데이트가 적용되지 않음')
                    } else {
                        console.log('업데이트 적용됨')
                        res.setHeader('Set-Cookie', `session=${sessionId}; Path=/; HttpOnly; SameSite=Lax`);
                        res.status(200).json(results);
                    }
                } catch (err: any) {
                    res.status(500).json({ statusCode: 500, message: err.message })
                }
            }
        } catch (err: any) {
            res.status(500).json({ statusCode: 500, message: err.message })
        }
    } else if (req.method === 'PUT') {
        // PUT 요청 처리
    } else if (req.method === 'DELETE') {
        // DELETE 요청 처리
    } else {
        // 그 외의 HTTP 메서드 처리
        res.status(405).send({ message: 'Method Not Allowed' });
    }
}

export default handler