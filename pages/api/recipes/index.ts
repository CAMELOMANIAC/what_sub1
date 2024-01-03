import { NextApiRequest, NextApiResponse } from 'next'
import { insertRecipe, getRecipes } from '../../../utils/api/recipes';
import { recipeType } from '../../../interfaces/api/recipes';
import { checkSession } from '../../../utils/api/users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    let { limit } = req.query;
    let { offset } = req.query;

    //이 엔드포인트는 모든 레시피 정보를 반환합니다
    if (req.method === 'GET') {
        //모든 레시피 정보 가져오기
        try {
            const filter = ['메뉴이름', '레시피제목', '작성자', '재료', '태그'];
            //offset,limit는 옵셔널 쿼리문자열이므로 추가적 처리가 필요
            if (typeof limit === 'undefined') {
                limit = '9';
            }
            if (typeof offset === 'undefined') {
                offset = '0';
            }

            const results: recipeType[] | Error = await getRecipes({ searchQuery: ' ', offset: Number(offset), limit: Number(limit), filter });

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

    } else if (req.method === 'POST') {
        //레시피 추가하기
        try {

            if (req.headers.cookie) {
                const userId = await checkSession(req.headers.cookie);

                if (typeof userId === 'string') {
                    const recipe = req.body
                    const insertRecipeResult = await insertRecipe(userId, recipe);

                    if (insertRecipeResult instanceof Error) {
                        console.log('실패')
                        throw insertRecipeResult
                    } else {
                        res.status(200).json({message:'성공'});
                        console.log('성공')
                    }
                }

            } else {
                throw new Error('쿠키 값이 없습니다')
            }

        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }

    } else {
        res.status(405).send({ message: '허용되지 않은 메서드' });
    }
}

export default handler