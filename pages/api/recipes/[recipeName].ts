import { NextApiRequest, NextApiResponse } from 'next';
import { getRecipes } from '../../../utils/api/recipes';
import { recipeType } from '../../../interfaces/api/recipes';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { recipeName } = req.query;
    let { limit } = req.query;
    let { offset } = req.query;
    let { filter } = req.query;

    //이 엔드포인트는 recipeName 값에 맞는 결과를 반환합니다
    if (req.method === 'GET') {

        try {
            if (typeof recipeName === 'string') {
                //offset,limit,filter는 옵셔널 쿼리문자열이므로 추가적 처리가 필요
                if (typeof limit === 'undefined') {
                    limit = '3';
                }
                if (typeof offset === 'undefined') {
                    offset = '0';
                }
                if (typeof filter === 'string') {
                    filter = [filter];
                } else if (typeof filter === 'undefined') {
                    filter = ['메뉴이름', '레시피제목', '작성자', '재료', '태그'];
                }

                const results: recipeType[] | Error = await getRecipes({ searchQuery: recipeName, offset: Number(offset), limit: Number(limit), filter });
                
                if (results instanceof Error) {
                    console.log(results)
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
        // 그 외의 HTTP 메서드 처리
        res.status(405).send({ message: '허용되지 않은 요청 메서드 입니다.' });
    }
}



export default handler