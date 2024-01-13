import { NextApiRequest, NextApiResponse } from 'next'
import { getRecommendedRecipes } from '../../../utils/api/recipes';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const results = await getRecommendedRecipes();

            if (results instanceof Error) {
                throw results
            } else {
                res.status(200).json(results);
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                switch (err.message) {
                    case '적합한 결과가 없음':
                        res.status(204).end(); break;
                    default:
                        res.status(500).json({ message: err.message }); break;
                }
            }
        }

    } else {
        res.status(405).send({ message: '허용되지 않은 메서드' });
    }
}



export default handler