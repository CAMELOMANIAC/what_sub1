import { NextApiRequest, NextApiResponse } from 'next';
import { loadRecipes } from '../../../utils/api/recipes';
import { recipeType } from '../../../interfaces/api/recipes';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { recipeName } = req.query;
    const { limit } = req.query;
    const { offset } = req.query;
    let { filter } = req.query;
    //이 엔드포인트는 한명의 유저정보를 불러옵니다
    if (req.method === 'GET') {
        if (typeof recipeName === 'string' && typeof offset === 'string' && typeof limit === 'string' && filter !== undefined) {
            try {
                if (typeof filter === 'string'){
                    filter = [filter]
                }

                const results: recipeType[] | Error = await loadRecipes({ searchQuery: recipeName, offset:Number(offset), limit:Number(limit), filter });
                console.log(results)

                if (results instanceof Error) {
                    res.status(500).json({ statusCode: 500, message: results.message });
                } else {
                    res.status(200).json(results);
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    res.status(500).json({ statusCode: 500, message: err.message });
                }
            }
        } else {
            res.status(500).json({ statusCode: 500, message: '응답받은 값이 잘못된 형식입니다' });
        }
    } else if (req.method === 'POST') {
        // POST 요청 처리

    } else {
        // 그 외의 HTTP 메서드 처리
        res.status(405).send({ message: '허용되지 않은 요청 메서드입니다' });
    }
}



export default handler