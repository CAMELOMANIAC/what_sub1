import { recipeContextType } from "../../interfaces/AddRecipe";
import { updateReturnType } from "../../interfaces/api/db";
import { getRecipesArg, recipeType, replyType, userRecipeLikeTopDataType } from "../../interfaces/api/recipes";
import executeQuery from "../../lib/db";

//검색어를 통한 레시피 반환
export const getRecipes = async ({ searchQuery, offset, limit, filter, sort }: getRecipesArg): Promise<recipeType[] | Error> => {
    try {
        let filterQuery;
        if (Array.isArray(filter)) {
            filterQuery = filter.map((item) => {
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
        COUNT(DISTINCT reply_table.reply_id) AS reply_count,
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
        ORDER BY ${sort} DESC 
        LIMIT ? OFFSET ?;
        `
        const sanitizedQueryArray: string[] = [];
        const sanitizedQuery = '%' + searchQuery + '%';
        filter.forEach(() => {
            sanitizedQueryArray.push(sanitizedQuery);
        });

        const offsetQuery = Number(offset);
        const limitQuery = Number(limit);
        const results: recipeType[] | Error = await executeQuery({
            query: query,
            values: [...sanitizedQueryArray, limitQuery, offsetQuery]
        });
        
        if (Array.isArray(results) && results.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else {
            return results;
        }

    } catch (err) {
        return err
    }
}

type recipeIdArgType = Omit<getRecipesArg, 'searchQuery' | 'filter'> & { recipeIdArray: number[] };
/**
 * 레시피 아이디를 통한 레시피 반환
 * @param recipeId DB에서 찾을때 기준으로 사용될 레시피 아이디 입니다.
 * @param offset SQL OFFSET 키워드에 사용될 값 입니다.(위에서부터 몇번째부터 가져올지)
 * @param limit SQL LIMIT 키워드에 사용될 값 입니다.(몇 개 가져올지)
 * @param sort SQL DESC SORT 키워드에 사용될 값 입니다.(정렬순서 기준 내림차순으로)
 * @returns {Promise<recipeType[] | Error>} - 레시피 정보를 프로미스 객체로 반환합니다. 쿼리 실행 중 에러가 발생한 경우 Error 객체를 반환합니다.
 * @throws {Error} - 쿼리 실행 중 에러가 발생한 경우 Error 객체를 던집니다.
 * @example
 * getRecipesFromRecipeId({1,2,3},0,9,'like_count') // returns [{recipe_id:1,...,like_count:'13'},{recipe_id:2,...,like_count:'7'},{recipe_id:3,...,like_count:'0'}]
 * getRecipesFromRecipeId({4,5,6},0,9,'like_count') // returns Error('적합한 결과가 없음')
 */
export const getRecipesFromRecipeId = async ({ recipeIdArray, offset, limit, sort }: recipeIdArgType): Promise<recipeType[] | Error> => {
    try{
        const query = `SELECT 
        recipe_table.recipe_id, 
        recipe_table.recipe_name, 
        GROUP_CONCAT(DISTINCT recipe_ingredients_table.recipe_ingredients) AS recipe_ingredients, 
        recipe_table.user_table_user_id, 
        recipe_table.sandwich_table_sandwich_name, 
        GROUP_CONCAT(DISTINCT recipe_tag_table.tag_table_tag_name) AS tag, 
        COUNT(DISTINCT reply_table.reply_id) AS reply_count, 
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
        WHERE recipe_table.recipe_id IN ( ? )
        GROUP BY recipe_table.recipe_id, 
        recipe_table.recipe_name, 
        recipe_table.user_table_user_id, 
        recipe_table.sandwich_table_sandwich_name 
        ORDER BY ${sort} DESC 
        LIMIT ? OFFSET ?;`
        
        const sanitizedRecipeId = recipeIdArray;
        const offsetQuery = Number(offset);
        const limitQuery = Number(limit);
        const results: recipeType[] | Error = await executeQuery({
            query: query,
            values: [sanitizedRecipeId, limitQuery, offsetQuery]
        });

        if (Array.isArray(results) && results.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else {
            return results;
        }

    }catch(err){
        return err
    }
}

//좋아요 레시피 반환
export const getRecipeLike = async (userId: string): Promise<{ recipe_table_recipe_id: string } | Error> => {
    const query = `SELECT recipe_table_recipe_id FROM recipe_like_table WHERE user_table_user_id = ?;`
    const userIdValue = userId;
    try {
        const results: { recipe_table_recipe_id: string } | Error = await executeQuery({
            query: query,
            values: [userIdValue]
        });
        if (Array.isArray(results) && results.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else {
            return results;
        }
    } catch (err) {
        return err
    }
}

//DB 레시피 테이블에 저장
export const insertRecipe = async (checkedUser: string, recipe: recipeContextType): Promise<updateReturnType | Error> => {
    const { recipeName, tagArray, param: recipeMenu, addMeat, bread, cheese, addCheese, isToasting,
        vegetable, pickledVegetable, sauce, addIngredient } = recipe;

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
        const results: updateReturnType | Error = await executeQuery(
            { query: query, values: [recipeName, checkedUser, recipeMenu, ...recipeIngredients, ...tagArray, ...tagArray] }
        );
        if ('affectedRows' in results && results.affectedRows === 0) {
            throw new Error('일치하는 행이 없거나 이미 수정되어 수정할 수 없음');
        } else {
            return results;
        }

    } catch (err) {
        return err
    }
}

//레피시 좋아요 추가
export const insertRecipeLike = async (recipeId: number, userId: string): Promise<updateReturnType | Error> => {
    const query = `INSERT INTO recipe_like_table(recipe_table_recipe_id,user_table_user_id) VALUES (?,?);`
    const recipeIdValue = recipeId;
    const userIdValue = userId;
    try {
        const results: updateReturnType | Error = await executeQuery(
            { query: query, values: [recipeIdValue, userIdValue] }
        );
        if ('affectedRows' in results && results.affectedRows === 0) {
            throw new Error('일치하는 행이 없거나 이미 수정되어 수정할 수 없음');
        } else {
            return results;
        }

    } catch (err) {
        return err
    }
}

//레피시 좋아요 제거
export const deleteRecipeLike = async (recipeId: number, userId: string): Promise<updateReturnType | Error> => {
    const query = `DELETE FROM recipe_like_table WHERE recipe_table_recipe_id = ? AND user_table_user_id = ?;`
    const recipeIdValue = recipeId;
    const userIdValue = userId;
    try {
        const results: updateReturnType | Error = await executeQuery(
            { query: query, values: [recipeIdValue, userIdValue] }
        );

        if ('affectedRows' in results && results.affectedRows === 0) {
            throw new Error('일치하는 행이 없거나 이미 삭제되어 삭제할 수 없음');
        } else {
            return results;
        }

    } catch (err) {
        return err
    }
}

//레시피 좋아요 했었는지 체크
export const checkRecipeLike = async (recipeId: number, userId: string): Promise<boolean | Error> => {

    const query = `SELECT count(*) as count FROM recipe_like_table 
    WHERE recipe_like_table.recipe_table_recipe_id = ? 
    AND user_table_user_id = ?;`

    const recipeIdValue = recipeId;
    const userIdValue = userId;
    try {
        const results: { count: number } | Error = await executeQuery(
            { query: query, values: [recipeIdValue, userIdValue] }
        );

        if (Array.isArray(results) && results.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else if (results[0].count > 0) {
            return true;
        } else {
            return false;
        }

    } catch (err) {
        return err
    }
}

//추천메뉴
export const getRecommendedRecipes = async (): Promise<recipeType[] | Error> => {
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
    LIMIT 3;`

    try {
        const results: recipeType[] | Error = await executeQuery(
            { query: query, values: [] }
        );

        if (Array.isArray(results) && results.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else {
            return results
        }

    } catch (err) {
        return err;
    }
}

export const getReply = async (recipeId: number): Promise<replyType[] | Error> => {
    const query = `select * from reply_table where recipe_table_recipe_id = ?;`

    try {
        const results: replyType[] | Error = await executeQuery(
            { query: query, values: [recipeId] }
        )

        if (Array.isArray(results) && results.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else {
            return results
        }

    } catch (err) {
        return err;
    }
}

export const insertReply = async (replyContext: string, recipeId: number, userId:string): Promise<replyType[] | Error> => {
    const query = `INSERT INTO reply_table (reply_context, recipe_table_recipe_id, user_table_user_id) values (?, ?, ?);`

    try {
        const results: replyType[] | Error = await executeQuery(
            { query: query, values: [replyContext,recipeId,userId] }
        )

        if (Array.isArray(results) && results.length < 1) {
            throw new Error('일치하는 행이 없거나 이미 수정되어 수정할 수 없음')
        } else {
            return results
        }

    } catch (err) {
        return err;
    }
}

/**
 * 작성한 레시피와 좋아요 갯수 불러오기
 * @param userId - DB에 저장된 사용자 ID. 이 ID는 사용자가 작성한 레시피를 찾는 데 사용됩니다.
 * @returns {Promise<Array<userRecipeLikeTopDataType> | Error>} 작성한 레시피 정보를 담은 배열을 프로미스객체로 반환합니다. 
 *          만약 사용자가 작성한 레시피가 없거나, 쿼리 실행 중 에러가 발생하면 Error 객체를 반환합니다.
 * @throws {Error} - 쿼리 결과가 없거나, 쿼리 실행 중 에러가 발생한 경우 Error 객체를 던집니다.
 * @example
 * getRecipeLikeTop('user123'); // returns [{ sandwich_table_sandwich_name: 'B.L.T', recipe_name:'J.M.T', like_count:4 }, { sandwich_table_sandwich_name: '에그마요', recipe_name:'테스트' like_count:2 }]
 * getRecipeLikeTop('user456'); // returns Error('적합한 결과가 없음')
 */
export const getRecipeLikeTop = async (userId: string): Promise<Array<userRecipeLikeTopDataType> | Error> => {
    const query = `SELECT r.sandwich_table_sandwich_name ,r.recipe_name, COUNT(l.recipe_table_recipe_id) as like_count
    FROM recipe_table r
    LEFT JOIN recipe_like_table l ON r.recipe_id = l.recipe_table_recipe_id
    WHERE r.user_table_user_id = ?
    GROUP BY r.recipe_id ORDER BY like_count desc LIMIT 3;`
    const userIdValue = userId;
    try {
        const results: Array<userRecipeLikeTopDataType> | Error = await executeQuery({
            query: query,
            values: [userIdValue]
        });
        if (Array.isArray(results) && results.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else {
            return results;
        }
    } catch (err) {
        return err
    }
}