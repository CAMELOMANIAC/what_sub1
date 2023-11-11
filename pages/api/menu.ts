import { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../lib/db'
import { breadNutrientArray, sauceNutrientArray } from '../../utils/menuArray'
import { loginCheck } from './login'

export type totalMenuInfoType = {
    sandwichName:string,
    likeCount: string,
    recipeCount: string,
    recipeLikeCount: string
}

//menu관련 정보 불러오기
const loadTotalMenuInfo = async () => {
    const query = `SELECT 
    sandwich_table.sandwich_name,
    (SELECT COUNT(*) FROM sandwich_like_table WHERE sandwich_table_sandwich_name = sandwich_table.sandwich_name) AS like_count,
    (SELECT COUNT(*) FROM recipe_table WHERE sandwich_table_sandwich_name = sandwich_table.sandwich_name) AS recipe_count,
    (SELECT COUNT(*) FROM recipe_like_table LEFT JOIN recipe_table ON recipe_like_table.recipe_table_recipe_id = recipe_table.recipe_id WHERE sandwich_table_sandwich_name = sandwich_table.sandwich_name) AS recipe_like_count
    FROM sandwich_table;
    `

    try {
        const results = await executeQuery({
            query: query,
            values: []
        });
        console.log(results)
        return results.map((item)=>{
            return {
                sandwichName: item.sandwich_name,
                likeCount: item.like_count,
                recipeCount: item.recipe_count,
                recipeLikeCount: item.recipe_like_count
            }
        
        });
    } catch (err) {
        throw new Error('검색실패: ' + err.message);
    }
}
//menu관련 정보 불러오기
const loadMenuInfo = async (sandwichMenu: string) => {
    const sandwichQuery = sandwichMenu;

    const query = `SELECT 
    (SELECT COUNT(*) FROM sandwich_like_table WHERE sandwich_table_sandwich_name = ? ) AS like_count,
    (SELECT COUNT(*) FROM recipe_table WHERE sandwich_table_sandwich_name = ? ) AS recipe_count,
    (SELECT count(*) FROM recipe_like_table LEFT JOIN recipe_table ON recipe_like_table.recipe_table_recipe_id = recipe_table.recipe_id WHERE sandwich_table_sandwich_name = ?) AS recipe_like_count;
    `

    try {
        const results = await executeQuery({
            query: query,
            values: [sandwichQuery, sandwichQuery, sandwichQuery]
        });

        return results;
    } catch (err) {
        throw new Error('검색실패: ' + err.message);
    }
}
//top재료 불러오기
const loadTopIngredients = async (sandwichMenu: string, ingredientsType: string) => {
    const sandwichQuery = sandwichMenu;

    const query = `SELECT recipe_ingredients_table.recipe_ingredients, count(*) as occurrence,
        (SELECT count(*) FROM recipe_like_table WHERE recipe_like_table.recipe_table_recipe_id = ANY_VALUE(recipe_table.recipe_id)) as likes 
    FROM 
        recipe_ingredients_table 
    LEFT JOIN 
        recipe_table 
    ON 
        recipe_table.recipe_id = recipe_ingredients_table.recipe_table_recipe_id 
    WHERE 
        recipe_table.sandwich_table_sandwich_name = ? 
        AND recipe_ingredients_table.recipe_ingredients IN (${ingredientsType === 'bread' ? String(breadNutrientArray.map(() => ' ? ')) : ingredientsType === 'sauce' ? String(sauceNutrientArray.map(() => ' ? ')) : ''}) 
    GROUP BY 
        recipe_ingredients_table.recipe_ingredients 
    ORDER BY 
        occurrence DESC 
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
        return results

    } catch (err) {
        throw new Error('검색실패: ' + err.message);
    }
}
//조합재료 불러오기
const loadRecipeIngredients = async (sandwichMenu, ingredientsType: string) => {
    const sandwichQuery = sandwichMenu;
    const query = `SELECT subquery.combined_ingredients, COUNT(*) as occurrence, IFNULL(MAX(likes_table.likes), 0) as likes 
    FROM (
        SELECT recipe_ingredients_table.recipe_table_recipe_id, GROUP_CONCAT(recipe_ingredients_table.recipe_ingredients SEPARATOR ', ') as combined_ingredients 
        FROM recipe_ingredients_table 
        LEFT JOIN recipe_table ON recipe_table.recipe_id = recipe_ingredients_table.recipe_table_recipe_id 
        WHERE recipe_table.sandwich_table_sandwich_name = ? 
        AND(recipe_ingredients_table.recipe_ingredients IN (${ingredientsType === 'sauce' ? String(sauceNutrientArray.map(() => ' ? ')) : ''}) )
        GROUP BY recipe_ingredients_table.recipe_table_recipe_id 
    ) as subquery
    LEFT JOIN (
        SELECT recipe_table_recipe_id, COUNT(*) as likes 
        FROM recipe_like_table 
        GROUP BY recipe_table_recipe_id 
    ) as likes_table ON likes_table.recipe_table_recipe_id = subquery.recipe_table_recipe_id 
    GROUP BY subquery.combined_ingredients 
    HAVING COUNT(*) >= 1 
    ORDER BY 
        occurrence DESC
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
        return results
    } catch (err) {
        throw new Error('검색실패: ' + err.message);
    }
}
//좋아요 메뉴 검색
const loadMenuLike = async (userId) => {
    const query = `SELECT sandwich_table_sandwich_name FROM sandwich_like_table WHERE user_table_user_id = ?;`
    const userIdValue = userId;
    try {
        const results = await executeQuery({
            query: query,
            values: [userIdValue]
        });
        return results.map((item: { sandwich_table_sandwich_name: string }) => item.sandwich_table_sandwich_name);
    } catch (err) {
        throw new Error('검색실패: ' + err.message);
    }
}

//메뉴 좋아요 추가
const insertMenuLike = async (menuName, userId) => {
    const query = `INSERT INTO sandwich_like_table(sandwich_table_sandwich_name,user_table_user_id) values (?,?);`
    const menuNameValue = menuName;
    const userIdValue = userId;
    try {
        const results = await executeQuery(
            { query: query, values: [menuNameValue, userIdValue] }
        );
        if (results.affectedRows === 1)
            return true;
        else {
            return false
        }
    } catch (err) {
        console.log(err.message)
        return false;
    }
}
//메뉴 좋아요 제거
const deleteMenuLike = async (menuName, userId) => {
    const query = `DELETE FROM sandwich_like_table WHERE sandwich_table_sandwich_name = ? AND user_table_user_id = ?;`
    const menuNameValue = menuName;
    const userIdValue = userId;
    try {
        const results = await executeQuery(
            { query: query, values: [menuNameValue, userIdValue] }
        );

        if (results.affectedRows === 1)
            return true;
        else {
            return false
        }
    } catch (err) {
        console.log(err.message)
        return false;
    }
}
//메뉴 좋아요 했었는지 체크
const checkMenuLike = async (menuName, userId) => {
    const query = `SELECT count(*) as count FROM sandwich_like_table 
    WHERE sandwich_table_sandwich_name = ? 
    AND user_table_user_id = ?;`
    const menuNameValue = menuName;
    const userIdValue = userId;
    try {
        const results = await executeQuery(
            { query: query, values: [menuNameValue, userIdValue] }
        );
        if (results.map(item => item.count) > 0)
            return true;
        else {
            return false
        }
    } catch (err) {
        console.log(err.message)
        return false;
    }
}
const countMenuLike = async (menuName) => {
    const query = `SELECT count(*) as count FROM sandwich_like_table 
    WHERE sandwich_table_sandwich_name = ? ;`
    const menuNameValue = menuName;
    try {
        const result = await executeQuery(
            { query: query, values: [menuNameValue] }
        );
        return result.map(item=>item.count);
    } catch (err) {
        console.log(err.message)
        return false;
    }
}


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const topIngredients: string | string[] | undefined = req.query.topIngredients;
        const query: string | string[] | undefined = req.query.query;
        const isTotal: string | string[] | undefined = req.query.isTotal;
        const isLikeMenu: string | string[] | undefined = req.query.isLikeMenu;
        const likeMenuCount: string | string[] | undefined = req.query.likeMenuCount;
        try {
            if (topIngredients) {//top3 조합법 요청시
                if (typeof query === 'string' && typeof topIngredients === 'string') {
                    let recipe;
                    if (topIngredients === 'bread') {
                        recipe = await loadTopIngredients(query, topIngredients);
                    }
                    else if (topIngredients === 'sauce') {
                        recipe = await loadRecipeIngredients(query, topIngredients);
                    }
                    res.status(200).json(recipe)
                } else {
                    console.log('문자열외 값을 요청받음' + query + ',' + topIngredients);
                    res.status(500).json({ statusCode: 500, message: '문자열외에 쿼리스트링은 사용할수없음' })
                }
            } else if (query) {//메뉴관련 정보 요청시
                if (typeof query === 'string') {
                    const results = await loadMenuInfo(query)
                    res.status(200).json(results);
                } else {
                    console.log('문자열외 값을 요청받음' + query + ',' + topIngredients);
                    res.status(500).json({ statusCode: 500, message: '문자열외에 쿼리스트링은 사용할수없음' })
                }
            } else if (isTotal) {//각 메뉴 관련 정보를 모두 요청시
                const results = await loadTotalMenuInfo()
                res.status(200).json(results);
            } else if (isLikeMenu) {//유저의 메뉴 좋아요 정보 요청시
                console.log(isLikeMenu)
                const user_id = await loginCheck(req.headers.cookie);
                const results = await loadMenuLike(user_id)
                res.status(200).json(results);
            } else if (likeMenuCount){//메뉴 좋아요 갯수 정보 요청시
                const result = await countMenuLike(likeMenuCount)
                res.status(200).json(result);
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).json({ statusCode: 500, message: err.message });
            }
        }



    } else if (req.method === 'POST') {
        let checkedUser;
        const insert = req.query.insert
        if (req.headers.cookie) {//유저 확인
            checkedUser = await loginCheck(req.headers.cookie);
            if (checkedUser) {
                console.log('유저맞음')
                if (insert === 'menuLike') {//메뉴 좋아요 클릭시 실행되는 부분
                    const menu = req.body
                    const checkMenuLikeResult = await checkMenuLike(menu, checkedUser);
                    console.log(checkMenuLikeResult)
                    if (checkMenuLikeResult === false) {
                        const insertRecipeLikeResult = await insertMenuLike(menu, checkedUser);
                        if (insertRecipeLikeResult) {
                            console.log('저장성공')
                            res.status(200).json('insertMenuLike성공')
                        } else {
                            res.status(500).json({ message: '저장실패' })
                            console.log('저장실패')
                        }
                    } else if (checkMenuLikeResult === true) {
                        const deleteMenuLikeResult = await deleteMenuLike(menu, checkedUser);
                        if (deleteMenuLikeResult) {
                            console.log('제거성공')
                            res.status(200).json('deleteMenuLike성공')
                        } else {
                            res.status(500).json({ message: '제거실패' })
                            console.log('제거실패')
                        }
                    }
                }
            }
        }
    } else {
        // 그 외의 HTTP 메서드 처리
        res.status(405).send({ message: 'Method Not Allowed' });
    }
}



export default handler