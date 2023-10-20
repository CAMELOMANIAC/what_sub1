import { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../lib/db'

const checkSession = async (session: string) => {
    try {
        const sql = `SELECT * FROM user WHERE session = ?`;
        const result = await executeQuery({ query: sql, values: [session] });

        if (result.length === 0)
            return false;
        else return true;

    } catch (err) {
        console.error(err.message);
    }

}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        console.log('체크함')
        const sessionCookie = req.cookies['session'];

        const result = await checkSession(sessionCookie!);
        res.status(200).json(result)

    } else {
        res.status(405).send({ message: 'Method Not Allowed' });
    }
}


export default handler