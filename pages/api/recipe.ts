import { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../lib/db'


const loadRecipes = async (searchQuery: string | string[] | undefined, offset: number, limit: number, filter: string | string[] | undefined) => {
    try {
        let filterArray;
        if (Array.isArray(filter)) {
            filterArray = filter;
        } else {
            filterArray = [filter];
        }

        let filterQuery;
        if (filterArray.length > 0) {
            filterQuery = filterArray.map((item) => {
                switch (item) {
                    case '메뉴이름': return ' recipe_table.sandwich_table_sandwich_name LIKE ? ';
                    case '레시피제목': return ' recipe_table.recipe_name LIKE ? ';
                    case '작성자': return ' recipe_table.user_table_user_id LIKE ? ';
                    case '재료': return ' recipe_ingredients LIKE ? ';
                    case '태그': return ' tag LIKE ? ';
                }
            })
        }
        console.log(filterQuery)

        const query = `SELECT 
        recipe_table.recipe_name, 
        GROUP_CONCAT(DISTINCT recipe_ingredients_table.recipe_ingredients) AS recipe_ingredients, 
        recipe_table.user_table_user_id, 
        recipe_table.sandwich_table_sandwich_name, 
        GROUP_CONCAT(DISTINCT recipe_tag_table.tag_table_tag_name) AS tag,
        COUNT(DISTINCT reply_table.reply_context) AS reply_count,
        COALESCE(like_counts.like_count, 0) AS like_count
        FROM recipe_table 
        LEFT JOIN recipe_ingredients_table ON recipe_table.recipe_id = recipe_ingredients_table.recipe_table_recipe_id
        LEFT JOIN recipe_tag_table ON recipe_table.recipe_id = recipe_tag_table.recipe_table_recipe_id
        LEFT JOIN reply_table ON recipe_table.recipe_id = reply_table.recipe_table_recipe_id
        LEFT JOIN (
        SELECT recipe_table_recipe_id, COUNT(*) AS like_count
        FROM recipe_like_table
        GROUP BY recipe_table_recipe_id
        ) AS like_counts ON recipe_table.recipe_id = like_counts.recipe_table_recipe_id
        GROUP BY recipe_table.recipe_id, 
        recipe_table.recipe_name, 
        recipe_table.user_table_user_id, 
        recipe_table.sandwich_table_sandwich_name
        HAVING ${String(filterQuery).replaceAll(',','OR')}
        LIMIT ? OFFSET ?;
        `
        const sanitizedQueryArray: string[] = [];
        const sanitizedQuery = '%' + searchQuery + '%';
        filterArray.forEach(() => {
            sanitizedQueryArray.push(sanitizedQuery);
        });

        console.log(query)
        const offsetQuery = offset;
        const limitQuery = limit;

        const results = await executeQuery({
            query: query,
            values: [...sanitizedQueryArray, offsetQuery, limitQuery]
        });

        if (results.length === 0) {
            console.log('검색 결과 없음');
        }
        return results.map((index) => ({
            recipe_name: index.recipe_name,
            recipe_ingredients: index.recipe_ingredients,
            user_id: index.user_table_user_id,
            sandwich_name: index.sandwich_table_sandwich_name,
            tag: index.tag,
            reply_count: index.reply_count,
            like_count: index.like_count
        }));
    } catch (err) {
        throw new Error('검색실패: ' + err.message);
    }
}


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

//실제 레시피 테이블에 저장하는 함수
const insertRecipe = async (checkedUser, recipe) => {
    const recipeName = (recipe.find((item, index) => index === 0));
    const recipeTag = (recipe.find((item, index) => index === 1));
    const recipeMenu = (recipe.find((item, index) => index === 2));
    console.log('받은 레시피태그' + recipeTag)
    const tagPlaceholders = recipeTag.map(() => '(?)').join(',');
    const recipeTagPlaceholders = recipeTag.map(() => '(@last_recipe_id, ?)').join(',');
    const recipeIngredients = recipe.slice(3);
    const ingredientsPlaceholders = recipeIngredients.map(() => '(@last_recipe_id, ?)').join(',');
    console.log(ingredientsPlaceholders)
    console.log([recipeName, checkedUser, recipeMenu, ...recipeIngredients])
    const query = `BEGIN;
    INSERT INTO recipe_table (recipe_name, user_table_user_id, sandwich_table_sandwich_name) VALUES (?, ?, ?);
    SET @last_recipe_id = LAST_INSERT_ID();
    INSERT INTO recipe_ingredients_table (recipe_table_recipe_id, recipe_ingredients) VALUES ${ingredientsPlaceholders};
    INSERT IGNORE INTO tag_table (tag_name) VALUES ${tagPlaceholders};
    INSERT IGNORE INTO recipe_tag_table (recipe_table_recipe_id, tag_table_tag_name) VALUES ${recipeTagPlaceholders};
    COMMIT;`
    console.log(query)
    try {
        const results = await executeQuery(
            { query: query, values: [recipeName, checkedUser, recipeMenu, ...recipeIngredients, ...recipeTag, ...recipeTag] }
        );
        console.log(results)
        return true;
    } catch (err) {
        console.log(err.message)
        return false;
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    //get요청시
    if (req.method === 'GET') {
        const query = req.query.query;
        const limitQueryParam = req.query.limit;
        const offsetQueryParam = req.query.offset;
        const filter = req.query.filter;
        console.log('필터쿼리' + filter)

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
            const recipe = await loadRecipes(query, limit, offset, filter);
            res.status(200).json(recipe)
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }

    } else if (req.method === 'POST') {
        //포스트 요청시
        let checkedUser;
        const recipe = req.body.map(item => item);
        const recipeName = (recipe.find((item, index) => index === 0));
        if (req.headers.cookie) {
            checkedUser = await loginCheck(req.headers.cookie);
            if (checkedUser) {
                console.log('유저맞음')
                const insertResult = await insertRecipe(checkedUser, recipe);
                if (insertResult) {
                    console.log('저장성공')
                    res.status(200).json({ message: '저장성공', redirect: '/Recipes?param=' + recipeName })
                }

            } else {
                res.status(405).json({ message: '유저확인실패' })
                console.log('유저확인실패')
            }
        }
        else {
            res.status(200).json({ message: '쿠키가 전달되지 않았거나 생성되지(로그인되지) 않았음' })
            console.log('쿠키없음')
        }
    } else {
        res.status(405).send({ message: '허용되지 않은 메서드' });
    }

}


export default handler
