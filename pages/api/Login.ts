import { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../lib/db'
import { v4 as uuidv4 } from 'uuid';

const loginUser = async (id, pwd) => {
    try {
        //mysql에서 대소문자를 구분하지 않으므로 구분하도록 BINARY함수를 작성해줘야함
        const results = await executeQuery({ query: 'SELECT user_id, user_pwd FROM user_table WHERE BINARY user_id = ? AND BINARY user_pwd = ?', values: [id, pwd] });

        if (!Array.isArray(results)) {
            throw new Error('쿼리가 잘못 작성됨')
        } else if (results.length <= 0) {
            throw new Error('적당한 결과가 없음')
        }
        return results[0].user_id;
    } catch (err) {
        throw new Error('로그인 실패: ' + err.message);
    }
}

const updateSession = async (userId) => {
    try {
        const sessionId = uuidv4();
        const results = await executeQuery({ query: 'UPDATE user_table SET user_session = ? WHERE user_id = ?', values: [sessionId, userId] });

        if (results.affectedRows === 0) {
            throw new Error('업데이트가 적용되지 않음')
        }
        return sessionId;
    } catch (err) {
        throw new Error('세션 업데이트 실패: ' + err.message);
    }
}

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
    if (req.method === 'POST') {
        const id = req.body.id;
        const pwd = req.body.pwd;

        try {
            const userId = await loginUser(id, pwd);
            const sessionId = await updateSession(userId);

            res.setHeader('Set-Cookie', [
                `session=${sessionId}; Path=/; HttpOnly; SameSite=Lax`,
                `user=${userId}; Path=/; SameSite=Lax`
            ]);
            res.status(200).json({userId: userId})
            console.log('성공');
        } catch (err) {
            console.log('실패');
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    } else {
        res.status(405).send({ message: 'Method Not Allowed' });
    }
}


export default handler