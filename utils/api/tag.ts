import executeQuery from "../../lib/db";

export const getRecipeTag = async (sandwichMenu: string): Promise<Array<{ tag_name: string }> | Error> => {
    const query = `SELECT recipe_tag_table.tag_table_tag_name as tag_name
    FROM whatsub.recipe_table 
    LEFT JOIN recipe_tag_table ON recipe_table.recipe_id = recipe_tag_table.recipe_table_recipe_id 
    WHERE sandwich_table_sandwich_name = ? AND recipe_tag_table.tag_table_tag_name IS NOT NULL 
    GROUP BY recipe_tag_table.tag_table_tag_name 
    ORDER BY COUNT(*);`
    const sandwich = sandwichMenu;


    try {
        const results: Array<{ tag_name: string }> | Error = await executeQuery({
            query: query,
            values: [sandwich]
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

export const getTag = async (tagQuery: string): Promise<Array<{ tag_name: string }> | Error> => {
    const query = `SELECT * FROM tag_table WHERE tag_name LIKE ? LIMIT 20;`
    const tag = '%' + tagQuery + '%';

    try {
        const results: Array<{ tag_name: string }> | Error = await executeQuery({
            query: query,
            values: [tag]
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