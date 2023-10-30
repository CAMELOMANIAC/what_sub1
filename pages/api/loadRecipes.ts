import { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../lib/db'


const loadRecipes = async (searchQuery, offset, limit) => {
    try {
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
        HAVING recipe_table.sandwich_table_sandwich_name LIKE ? 
          OR recipe_table.recipe_name LIKE ? 
          OR recipe_table.user_table_user_id LIKE ? 
          OR recipe_ingredients LIKE ? 
          OR tag LIKE ? 
        LIMIT ? OFFSET ?;
        `

        const sanitizedQuery = '%' + searchQuery + '%'; // 검색 쿼리 전처리
        const offsetQuery = offset;
        const limitQuery = limit;

        const results = await executeQuery({
            query: query,
            values: [sanitizedQuery,sanitizedQuery,sanitizedQuery,sanitizedQuery,sanitizedQuery,offsetQuery,limitQuery]
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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const query = req.query.query;
        const limitQueryParam = req.query.limit;
        const offsetQueryParam = req.query.offset;
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
            const recipe = await loadRecipes(query, limit, offset);
            res.status(200).json(recipe)
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    } else {
        res.status(405).send({ message: '허용되지 않은 메서드' });
    }
}


export default handler
