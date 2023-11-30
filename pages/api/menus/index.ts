import { NextApiRequest, NextApiResponse } from 'next'
import { loadTotalMenuInfo } from '../../../utils/api/menus';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const results = await loadTotalMenuInfo()

            if (results instanceof Error) {
                throw results
            } else {
                res.status(200).json(results);
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).json({ statusCode: 500, message: err.message });
            }
        }

    } else {
        // 그 외의 HTTP 메서드 처리
        res.status(405).send({ message: 'Method Not Allowed' });
    }
}



export default handler