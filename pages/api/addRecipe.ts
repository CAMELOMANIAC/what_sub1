import { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../lib/db';

const loginCheck = async (cookie) => {
    //받은 쿠키를 공백제거하고 배열로 만들고 다시 객체로 변환한다.
    const cookies = cookie.replaceAll(' ', '').split(';').map((item) => {
        let key = item.split('=')[0]
        let value = item.split('=')[1]
        return { key, value }
    });
    console.log(cookies)
    const userIdCookie = cookies.find(item => item.key === 'user');
    const userSessionCookie = cookies.find(item => item.key === 'session');
    console.log(userSessionCookie.value)
    console.log(userIdCookie.value)

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
const insertRecipe = async (checkedUser,recipe) => {
    //받은 인자값을 분리해서 적절하게 sql문에 넣어줘야함
    const query = `BEGIN;
    INSERT INTO recipe_table (recipe_name, user_table_user_id,sandwich_table_sandwich_name) VALUES (?, ?,?);
    SET @last_recipe_id = LAST_INSERT_ID();
    INSERT INTO recipe_ingredients_table (recipe_table_recipe_id, recipe_ingredients) VALUES (@last_recipe_id, ?);
    COMMIT;`
    try {
        const results = await executeQuery(
            { query: query, values: [] }
        );
        if (results[0].isTrue === 1)
            return true
        else throw new Error('쿠키에 저장된 유저 정보가 올바르지 않습니다.')
    } catch (err) {
        console.log(err.message)
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        let checkedUser;
        const recipe = req.body.map(item => console.log(item));
        if (req.headers.cookie) {
            checkedUser = await loginCheck(req.headers.cookie);
            if (checkedUser) {
                console.log('유저맞음')
                insertRecipe(checkedUser,recipe)
            }
        }
        else console.log('쿠키없음')

        res.status(200).json('통신성공')
    }
}


export default handler