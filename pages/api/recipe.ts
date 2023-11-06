import { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../lib/db'
import { breadNutrientArray, sauceNutrientArray } from '../../utils/menuArray'
import { error } from 'console'

//일반적인 레시피 불러오기
const loadRecipes = async (searchQuery: string | string[] | undefined, offset: number, limit: number, filter: string | string[] | undefined) => {
    try {
        let filterArray;
        if (Array.isArray(filter)) {
            filterArray = filter;
        } else if (filter === '') {
            filterArray = ['메뉴이름']
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
        HAVING ${String(filterQuery).replaceAll(',', 'OR')}
        LIMIT ? OFFSET ?;
        `
        const sanitizedQueryArray: string[] = [];
        const sanitizedQuery = '%' + searchQuery + '%';
        filterArray.forEach(() => {
            sanitizedQueryArray.push(sanitizedQuery);
        });

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

//top재료 불러오기
const topIngredientsLoad = async (sandwichMenu: string, ingredientsType: string) => {
    const sandwichQuery = sandwichMenu;

    const query = `SELECT recipe_ingredients_table.recipe_ingredients FROM recipe_ingredients_table 
    LEFT JOIN recipe_table ON recipe_table.recipe_id = recipe_ingredients_table.recipe_table_recipe_id 
    WHERE recipe_table.sandwich_table_sandwich_name = ? 
     AND NOT recipe_ingredients_table.recipe_ingredients = 'true'
     AND NOT recipe_ingredients_table.recipe_ingredients = 'false' 
     ${ingredientsType === 'bread' ? String(breadNutrientArray.map(() => 'OR recipe_ingredients_table.recipe_ingredients = ? ')).replaceAll(',', '') :
            ingredientsType === 'sauce' ? String(sauceNutrientArray.map(() => 'OR recipe_ingredients_table.recipe_ingredients = ? ')).replaceAll(',', '') : ''}
    group by recipe_ingredients 
    ORDER BY count(*) DESC
    LIMIT 3;
    `
    try {
        let dynamicValues: string[] = [];
        if (ingredientsType === 'bread') {
            dynamicValues = breadNutrientArray.map((item) => item.name)
        } else if (ingredientsType === 'sauce') {
            dynamicValues = sauceNutrientArray.map((item) => item.name)
        }
        const results = await executeQuery({
            query: query,
            values: [sandwichQuery, ...dynamicValues]
        });
        return results.map(item => item.recipe_ingredients)

    } catch (err) {
        throw new Error('검색실패: ' + err.message);
    }
}

const recipeIngredientsLoad = async (sandwichMenu, ingredientsType: string) => {
    const sandwichQuery = sandwichMenu;
    const query = `SELECT combined_ingredients, COUNT(*) as occurrence 
    FROM ( 
        SELECT recipe_ingredients_table.recipe_table_recipe_id, GROUP_CONCAT(recipe_ingredients_table.recipe_ingredients SEPARATOR ', ') as combined_ingredients 
        FROM recipe_ingredients_table 
        LEFT JOIN recipe_table ON recipe_table.recipe_id = recipe_ingredients_table.recipe_table_recipe_id 
        where recipe_table.sandwich_table_sandwich_name = ?  
        AND(
            ${ingredientsType === 'bread' ? String(breadNutrientArray.map(() => 'recipe_ingredients_table.recipe_ingredients = ? ')).replaceAll(',', 'OR ') :
            ingredientsType === 'sauce' ? String(sauceNutrientArray.map(() => 'recipe_ingredients_table.recipe_ingredients = ? ')).replaceAll(',', 'OR ') : ''})
        GROUP BY recipe_ingredients_table.recipe_table_recipe_id 
    ) as subquery
    GROUP BY combined_ingredients
    HAVING COUNT(*) > 1;`

    try {
        let dynamicValues: string[] = [];
        if (ingredientsType === 'bread') {
            dynamicValues = breadNutrientArray.map((item) => item.name)
        } else if (ingredientsType === 'sauce') {
            dynamicValues = sauceNutrientArray.map((item) => item.name)
        }
        const results = await executeQuery({
            query: query,
            values: [sandwichQuery, ...dynamicValues]
        });
        return results.map(item => item.combined_ingredients)

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
    const tagPlaceholders = recipeTag.map(() => '(?)').join(',');
    const recipeTagPlaceholders = recipeTag.map(() => '(@last_recipe_id, ?)').join(',');
    const recipeIngredients = recipe.slice(3);
    const ingredientsPlaceholders = recipeIngredients.map(() => '(@last_recipe_id, ?)').join(',');
    const query = `BEGIN;
    INSERT INTO recipe_table (recipe_name, user_table_user_id, sandwich_table_sandwich_name) VALUES (?, ?, ?);
    SET @last_recipe_id = LAST_INSERT_ID();
    INSERT INTO recipe_ingredients_table (recipe_table_recipe_id, recipe_ingredients) VALUES ${ingredientsPlaceholders};
    INSERT IGNORE INTO tag_table (tag_name) VALUES ${tagPlaceholders};
    INSERT IGNORE INTO recipe_tag_table (recipe_table_recipe_id, tag_table_tag_name) VALUES ${recipeTagPlaceholders};
    COMMIT;`
    try {
        const results = await executeQuery(
            { query: query, values: [recipeName, checkedUser, recipeMenu, ...recipeIngredients, ...recipeTag, ...recipeTag] }
        );
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
        const topIngredients = req.query.topIngredients;

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
            //topIngredients 요청시
            if (topIngredients) {
                if (typeof query === 'string' && typeof topIngredients === 'string') {
                    let recipe;
                    if (topIngredients === 'bread') {
                        recipe = await topIngredientsLoad(query, topIngredients);
                    }
                    else if (topIngredients === 'sauce') {
                        recipe = await recipeIngredientsLoad(query, topIngredients);
                    }
                    console.log(recipe);
                    res.status(200).json(recipe)
                } else {
                    console.log('문자열외 값을 요청받을 수 없음' + query + ',' + topIngredients);
                    res.status(500).json({ statusCode: 500, message: '문자열외에 쿼리스트링은 사용하지 않아야함' })
                }
            } else {//일반적인 레시피 요청시
                const recipe = await loadRecipes(query, limit, offset, filter);
                console.log(recipe);
                res.status(200).json(recipe)
            }
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }

    } else if (req.method === 'POST') {
        //post 요청시
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
                    res.status(200).json({ message: '저장성공', redirect: '/Recipes?query=' + recipeName })
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
