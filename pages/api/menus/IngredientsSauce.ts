import { NextApiRequest, NextApiResponse } from 'next'
import { getRecipeIngredients } from '../../../utils/api/menus';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { sandwichMenu } = req.query;
    if (req.method === 'GET') {
        try {
            //top3 조합법 요청시
            if (typeof sandwichMenu === 'string') {
                const results = await getRecipeIngredients(sandwichMenu, 'sauce');

                if (results instanceof Error) {
                    throw results
                } else {
                    res.status(200).json(results);
                }
                
            } else {
                throw new Error('잘못된 요청값 형식 입니다.')
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).json({ statusCode: 500, message: err.message });
            }
        }
    } else {
        res.status(405).send({ message: '허용되지 않은 메서드' });
    }
}

export default handler