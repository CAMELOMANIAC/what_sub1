import { NextApiRequest, NextApiResponse } from 'next'
import { checkSession } from '../../../utils/api/users';
import { checkRecipeLike, deleteRecipeLike, insertRecipe, insertRecipeLike, loadRecipeLike, loadRecipes } from '../../../utils/api/recipes';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    //get요청시
    if (req.method === 'GET') {
        const query: string | string[] | undefined = req.query.query;
        const limitQueryParam: string | string[] | undefined = req.query.limit;
        const offsetQueryParam: string | string[] | undefined = req.query.offset;
        const filter: string | string[] | undefined = req.query.filter;
        const likeRecipe: string | string[] | undefined = req.query.likeRecipe;

        let offset = 0;
        if (typeof offsetQueryParam !== 'undefined') {
            if (Array.isArray(offsetQueryParam)) {
                offset = parseInt(offsetQueryParam[0]);
            } else {
                offset = parseInt(offsetQueryParam);
            }
        }
        let limit = 6;
        if (typeof limitQueryParam !== 'undefined') {
            if (Array.isArray(limitQueryParam)) {
                limit = parseInt(limitQueryParam[0]);
            } else {
                limit = parseInt(limitQueryParam);
            }
        }
        try {
            if (likeRecipe) {//레시피 좋아요정보
                if (req.headers.cookie) {
                    const checkedUser = await checkSession(req.headers.cookie);
                    if (checkedUser) {
                        console.log('유저맞음')
                        const results = await loadRecipeLike(checkedUser);
                        res.status(200).json(results)
                    }
                }
            } else {//일반적인 레시피 정보
                const recipe = await loadRecipes(query, limit, offset, filter);
                res.status(200).json(recipe)
            }
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }

    } else if (req.method === 'POST') {
        //post 요청시
        let checkedUser;
        const insert = req.query.insert
        if (req.headers.cookie) {
            checkedUser = await checkSession(req.headers.cookie);
            if (checkedUser) {
                console.log('유저맞음')
                if (insert === 'recipe') {
                    const recipe = req.body
                    const recipeName = recipe.recipeName;
                    const insertRecipeResult = await insertRecipe(checkedUser, recipe);
                    if (insertRecipeResult) {
                        console.log('저장성공')
                        res.status(200).json({ message: '저장성공', redirect: '/Recipes?query=' + recipeName + '&filter=레시피제목' })
                    } else {
                        res.status(500).json({ message: '저장실패' })
                        console.log('저장실패')
                    }
                } else if (insert === 'recipeLike') {
                    const recipe = req.body
                    const checkRecipeLikeResult = await checkRecipeLike(recipe, checkedUser);
                    console.log(checkRecipeLikeResult)
                    if (checkRecipeLikeResult === false) {
                        const insertRecipeLikeResult = await insertRecipeLike(recipe, checkedUser);
                        if (insertRecipeLikeResult) {
                            console.log('저장성공')
                            res.status(200).json('insertRecipeLike성공')
                        } else {
                            res.status(500).json({ message: '저장실패' })
                            console.log('저장실패')
                        }
                    } else if (checkRecipeLikeResult === true) {
                        const deleteRecipeLikeResult = await deleteRecipeLike(recipe, checkedUser);
                        if (deleteRecipeLikeResult) {
                            console.log('제거성공')
                            res.status(200).json('deleteRecipeLike성공')
                        } else {
                            res.status(500).json({ message: '제거실패' })
                            console.log('제거실패')
                        }
                    }
                }
            } else {
                res.status(405).json({ message: '유저확인실패' })
                console.log('유저확인실패')
            }
        }
        else {
            res.status(200).json({ message: '쿠키가 전달되지 않았거나 생성되지(로그인하지) 않았음' })
            console.log('쿠키없음')
        }
    } else {
        res.status(405).send({ message: '허용되지 않은 메서드' });
    }

}


export default handler
