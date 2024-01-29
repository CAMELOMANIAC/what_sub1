import { updateReturnType } from "../../interfaces/api/db";
import { totalMenuInfoType } from "../../interfaces/api/menus";
import executeQuery from "../../lib/db";
import { breadNutrientArray, sauceNutrientArray } from "../menuArray";

//menu관련 모든 정보 불러오기
export const getTotalMenuInfo = async (): Promise<totalMenuInfoType[] | Error> => {
    const query = `SELECT 
    sandwich_table.sandwich_name,
    (SELECT COUNT(*) FROM sandwich_like_table WHERE sandwich_table_sandwich_name = sandwich_table.sandwich_name) AS like_count,
    (SELECT COUNT(*) FROM recipe_table WHERE sandwich_table_sandwich_name = sandwich_table.sandwich_name) AS recipe_count,
    (SELECT COUNT(*) FROM recipe_like_table LEFT JOIN recipe_table ON recipe_like_table.recipe_table_recipe_id = recipe_table.recipe_id WHERE sandwich_table_sandwich_name = sandwich_table.sandwich_name) AS recipe_like_count
    FROM sandwich_table;
    `

    try {
        const results: totalMenuInfoType[] | Error = await executeQuery({
            query: query,
            values: []
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

//menu관련 검색된 정보 불러오기
export const getMenuInfo = async (sandwichMenu: string): Promise<totalMenuInfoType[] | Error> => {
    const sandwichQuery = sandwichMenu;

    const query = `SELECT 
    (SELECT COUNT(*) FROM sandwich_like_table WHERE sandwich_table_sandwich_name = ? ) AS like_count,
    (SELECT COUNT(*) FROM recipe_table WHERE sandwich_table_sandwich_name = ? ) AS recipe_count,
    (SELECT count(*) FROM recipe_like_table LEFT JOIN recipe_table ON recipe_like_table.recipe_table_recipe_id = recipe_table.recipe_id WHERE sandwich_table_sandwich_name = ?) AS recipe_like_count;
    `

    try {
        const results: totalMenuInfoType[] | Error = await executeQuery({
            query: query,
            values: [sandwichQuery, sandwichQuery, sandwichQuery]
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

//top재료 불러오기
export const getTopIngredients = async (sandwichMenu: string, ingredientsType: string): Promise<Array<{ recipe_ingredients: string }> | Error> => {
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

        const results: Array<{ recipe_ingredients: string }> | Error = await executeQuery({
            query: query,
            values: [sandwichQuery, ...dynamicValues]
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

//조합재료 불러오기
export const getRecipeIngredients = async (sandwichMenu: string, ingredientsType: string): Promise<Array<{ combined_ingredients: string }> | Error> => {
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

        const results: Array<{ combined_ingredients: string }> | Error = await executeQuery({
            query: query,
            values: [sandwichQuery, ...dynamicValues]
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

//좋아요 메뉴 불러오기
export const getMenuLike = async (userId: string): Promise<Array<{ sandwich_table_sandwich_name: string }> | Error> => {
    const query = `SELECT sandwich_table_sandwich_name FROM sandwich_like_table WHERE user_table_user_id = ?;`
    const userIdValue = userId;
    try {
        const results: Array<{ sandwich_table_sandwich_name: string }> | Error = await executeQuery({
            query: query,
            values: [userIdValue]
        });

        if (Array.isArray(results) && results.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else {
            return results;
        }

    } catch (err) {
        return err;
    }
}

//메뉴 좋아요 추가
export const insertMenuLike = async (menuName: string, userId: string): Promise<updateReturnType | Error> => {
    const query = `INSERT INTO sandwich_like_table(sandwich_table_sandwich_name,user_table_user_id) values (?,?);`
    const menuNameValue = menuName;
    const userIdValue = userId;
    try {
        const results: updateReturnType | Error = await executeQuery(
            { query: query, values: [menuNameValue, userIdValue] }
        );

        if ('affectedRows' in results && results.affectedRows === 0) {
            throw new Error('일치하는 행이 없거나 이미 삭제되어 삭제할 수 없음');
        } else {
            return results;
        }

    } catch (err) {
        return err;
    }
}

//메뉴 좋아요 제거
export const deleteMenuLike = async (menuName: string, userId: string): Promise<updateReturnType | Error> => {
    const query = `DELETE FROM sandwich_like_table WHERE sandwich_table_sandwich_name = ? AND user_table_user_id = ?;`
    const menuNameValue = menuName;
    const userIdValue = userId;
    try {
        const results: updateReturnType | Error = await executeQuery(
            { query: query, values: [menuNameValue, userIdValue] }
        );

        if ('affectedRows' in results && results.affectedRows === 0) {
            throw new Error('일치하는 행이 없거나 이미 삭제되어 삭제할 수 없음');
        } else {
            return results;
        }

    } catch (err) {
        return err;
    }
}

//메뉴 좋아요 했었는지 체크
export const checkMenuLike = async (menuName: string, userId: string): Promise<boolean | Error> => {
    const query = `SELECT count(*) as count FROM sandwich_like_table 
    WHERE sandwich_table_sandwich_name = ? 
    AND user_table_user_id = ?;`
    const menuNameValue = menuName;
    const userIdValue = userId;
    try {

        const results: Array<{ count: string }> | Error = await executeQuery(
            { query: query, values: [menuNameValue, userIdValue] }
        );

        if (Array.isArray(results) && results.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else if (results[0].count > 0) {
            return true;
        } else {
            return false;
        }

    } catch (err) {
        return err;
    }
}

//메뉴좋아요 수 불러오기
export const countMenuLike = async (menuName: string): Promise<number | Error> => {
    const query = `SELECT count(*) as count FROM sandwich_like_table 
    WHERE sandwich_table_sandwich_name = ? ;`
    const menuNameValue = menuName;
    try {
        const result: Array<{ count: string }> | Error = await executeQuery(
            { query: query, values: [menuNameValue] }
        );

        if (Array.isArray(result) && result.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else {
            return parseInt(result[0].count);
        }
    } catch (err) {
        return err;
    }
}

//메뉴좋아요 수 불러오기
export const getRecommendedMenus = async (): Promise<totalMenuInfoType[] | Error> => {
    const query = `SELECT 
    sandwich_table.sandwich_name,
    (SELECT COUNT(*) FROM sandwich_like_table WHERE sandwich_table_sandwich_name = sandwich_table.sandwich_name) AS like_count,
    (SELECT COUNT(*) FROM recipe_table WHERE sandwich_table_sandwich_name = sandwich_table.sandwich_name) AS recipe_count,
    (SELECT COUNT(*) FROM recipe_like_table LEFT JOIN recipe_table ON recipe_like_table.recipe_table_recipe_id = recipe_table.recipe_id WHERE sandwich_table_sandwich_name = sandwich_table.sandwich_name) AS recipe_like_count
    FROM sandwich_table
    ORDER BY recipe_like_count DESC
    LIMIT 3;`
    
    try {
        const results: Array<totalMenuInfoType> | Error = await executeQuery(
            { query: query, values: [] }
        );

        if (Array.isArray(results) && results.length < 1) {
            throw new Error('적합한 결과가 없음')
        } else {
            return results;
        }
    } catch (err) {
        return err;
    }
}