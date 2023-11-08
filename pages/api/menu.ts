import { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../lib/db'
import { breadNutrientArray, sauceNutrientArray } from '../../utils/menuArray'

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

        return results;
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


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const topIngredients :string | string[] | undefined = req.query.topIngredients;
        const query :string | string[] | undefined = req.query.query;
        const isTotal :string | string[] | undefined = req.query.isTotal;

        try {
            //topIngredients 요청시
            if (topIngredients) {
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
            } else if (query) {
                if (typeof query === 'string') {
                    const results = await loadMenuInfo(query)
                    res.status(200).json(results);
                } else {
                    console.log('문자열외 값을 요청받음' + query + ',' + topIngredients);
                    res.status(500).json({ statusCode: 500, message: '문자열외에 쿼리스트링은 사용할수없음' })
                }
            } else if (isTotal){
                if (typeof isTotal === 'string') {
                    const results = await loadTotalMenuInfo()
                    res.status(200).json(results);
                } else {
                    console.log('문자열외 값을 요청받음' + query + ',' + topIngredients);
                    res.status(500).json({ statusCode: 500, message: '문자열외에 쿼리스트링은 사용할수없음' })
                }

            }

        } catch (err: any) {
            res.status(500).json({ statusCode: 500, message: err.message })
        }



    } else if (req.method === 'POST') {
        // POST 요청 처리
    } else if (req.method === 'PUT') {
        // PUT 요청 처리
    } else if (req.method === 'DELETE') {
        // DELETE 요청 처리
    } else {
        // 그 외의 HTTP 메서드 처리
        res.status(405).send({ message: 'Method Not Allowed' });
    }
}



export default handler