import { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../lib/db'
import { loginCheck } from './login';
import { recipeContextType } from '../../interfaces/AppRecipe';

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
        recipe_table.recipe_id, 
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
            recipe_id: index.recipe_id,
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
//좋아요 레시피 검색
export const loadRecipeLike = async (userId) => {
    const query = `SELECT recipe_table_recipe_id FROM recipe_like_table WHERE user_table_user_id = ?;`
    const userIdValue = userId;
    try {
        const results = await executeQuery({
            query: query,
            values: [userIdValue]
        });
        return results.map((item: { recipe_table_recipe_id: string }) => item.recipe_table_recipe_id);
    } catch (err) {
        throw new Error('검색실패: ' + err.message);
    }
}

//실제 레시피 테이블에 저장하는 함수
const insertRecipe = async (checkedUser: string, recipe: recipeContextType) => {
    const { recipeName: recipeName,
        tagArray: tagArray,
        param: recipeMenu,
        addMeat: addMeat,
        bread: bread,
        cheese: cheese,
        addCheese: addCheese,
        isToasting: isToasting,
        vegetable: vegetable,
        pickledVegetable: pickledVegetable,
        sauce: sauce,
        addIngredient: addIngredient } = recipe;

    const tagPlaceholders = tagArray.map(() => '(?)').join(',');
    const recipeTagPlaceholders = tagArray.map(() => '(@last_recipe_id, ?)').join(',');
    let recipeIngredients: string[] = [addMeat, bread, cheese, addCheese, isToasting, ...vegetable, ...pickledVegetable, ...sauce, ...addIngredient];
    recipeIngredients = recipeIngredients.filter(item => item !== '');//''배열 제거
    const ingredientsPlaceholders = recipeIngredients.map(() => '(@last_recipe_id, ?)').join(',');
    const query = `BEGIN;
    INSERT INTO recipe_table (recipe_name, user_table_user_id, sandwich_table_sandwich_name) VALUES (?, ?, ?);
    SET @last_recipe_id = LAST_INSERT_ID();
    INSERT INTO recipe_ingredients_table (recipe_table_recipe_id, recipe_ingredients) VALUES ${ingredientsPlaceholders};
    ${tagArray.length > 0 ? `INSERT IGNORE INTO tag_table (tag_name) VALUES ${tagPlaceholders};` : ''}
    ${tagArray.length > 0 ? `INSERT IGNORE INTO recipe_tag_table (recipe_table_recipe_id, tag_table_tag_name) VALUES ${recipeTagPlaceholders};` : ''}
    COMMIT;`

    try {
        const results = await executeQuery(
            { query: query, values: [recipeName, checkedUser, recipeMenu, ...recipeIngredients, ...tagArray, ...tagArray] }
        );
        console.log(tagArray)
        console.log(query)
        console.log([recipeName, checkedUser, recipeMenu, ...recipeIngredients, ...tagArray, ...tagArray])
        console.log(results);
        return results;
    } catch (err) {
        console.log(err.message)
        return false;
    }
}
//레피시 좋아요 추가
const insertRecipeLike = async (recipeId, userId) => {
    const query = `INSERT INTO recipe_like_table(recipe_table_recipe_id,user_table_user_id) VALUES (?,?);`
    const recipeIdValue = recipeId;
    const userIdValue = userId;
    try {
        const results = await executeQuery(
            { query: query, values: [recipeIdValue, userIdValue] }
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
//레피시 좋아요 제거
const deleteRecipeLike = async (recipeId, userId) => {
    const query = `DELETE FROM recipe_like_table WHERE recipe_table_recipe_id = ? AND user_table_user_id = ?;`
    const recipeIdValue = recipeId;
    const userIdValue = userId;
    try {
        const results = await executeQuery(
            { query: query, values: [recipeIdValue, userIdValue] }
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
//레시피 좋아요 했었는지 체크
const checkRecipeLike = async (recipeId, userId) => {
    const query = `SELECT count(*) as count FROM recipe_like_table 
    WHERE recipe_like_table.recipe_table_recipe_id = ? 
    AND user_table_user_id = ?;`
    const recipeIdValue = recipeId;
    const userIdValue = userId;
    try {
        const results = await executeQuery(
            { query: query, values: [recipeIdValue, userIdValue] }
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
                    const checkedUser = await loginCheck(req.headers.cookie);
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
            checkedUser = await loginCheck(req.headers.cookie);
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
