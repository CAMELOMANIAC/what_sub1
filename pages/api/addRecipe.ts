import { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../lib/db';

const loginCheck = async (cookie) => {
    //받은 쿠키를 공백제거하고 배열로 만들고 다시 객체로 변환한다.
    const cookies = cookie.replaceAll(' ', '').split(';').map((item) => {
        let key = item.split('=')[0]
        let value = item.split('=')[1]
        return { key, value }
    });
    const userIdCookie = cookies.find(item => item.key === 'user');
    const userSessionCookie = cookies.find(item => item.key === 'session');

    const query = 'SELECT user_id FROM user_table WHERE BINARY user_id = ? AND BINARY user_session = ?'

    try {
        const results = await executeQuery(
            { query: query, values: [userIdCookie.value, userSessionCookie.value] }
        );
        if (results.length > 0)
            return results[0].user_id
        else throw new Error('쿠키에 저장된 유저 정보가 올바르지 않습니다.')
    } catch (err) {
        console.log(err.message)
    }
}

const insertRecipe = async (checkedUser, recipe) => {
    const recipeName = (recipe.find((item,index) => index === 0));
    const recipeMenu = (recipe.find((item,index) => index === 1));
    const recipeIngredients = recipe.slice(2);
    const placeholders = recipeIngredients.map(() => '(@last_recipe_id, ?)').join(',');
    console.log(placeholders)
    console.log([recipeName,checkedUser,recipeMenu,...recipeIngredients])
    const query = `BEGIN;
    INSERT INTO recipe_table (recipe_name, user_table_user_id, sandwich_table_sandwich_name) VALUES (?, ?, ?);
    SET @last_recipe_id = LAST_INSERT_ID();
    INSERT INTO recipe_ingredients_table (recipe_table_recipe_id, recipe_ingredients) VALUES ${placeholders};
    COMMIT;`
    console.log(query)
    try {
        const results = await executeQuery(
            { query: query, values: [recipeName,checkedUser,recipeMenu,...recipeIngredients] }
        );
        console.log(results)
        console.log(results.affectedRows)
        if (results.affectedRows === 0) {
            throw new Error('업데이트가 적용되지 않음')
        }
        return true;
    } catch (err) {
        console.log(err.message)
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        let checkedUser;
        const recipe = req.body.map(item =>item);
        const recipeName = (recipe.find((item,index) => index === 0));
        if (req.headers.cookie) {
            checkedUser = await loginCheck(req.headers.cookie);
            if (checkedUser) {
                console.log('유저맞음')
                const insertResult = await insertRecipe(checkedUser, recipe);
                if (insertResult){
                    console.log('저장성공')
                    res.status(200).json({message:'저장성공',redirect:'/Recipes?param='+recipeName})
                }
            
            } else{
                res.status(200).json({message:'유저확인실패'})
                console.log('유저확인실패')
            }
        }
        else{
            res.status(200).json({message:'쿠키가 전달되지 않았거나 생성되지(로그인되지) 않았음'})
            console.log('쿠키없음')
        }
    }
}


export default handler