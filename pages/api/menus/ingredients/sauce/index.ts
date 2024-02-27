import { NextApiRequest, NextApiResponse } from 'next'
import { getRecipeIngredients } from '../../../../../utils/api/menus';

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
                throw new Error('잘못된 요청값 입니다.')
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                switch (err.message) {
                    case '적합한 결과가 없음':
                        res.status(204).end(); break;
                    case '잘못된 요청값 입니다.':
                        res.status(400).json({ message: err.message }); break;
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