import { NextApiRequest, NextApiResponse } from "next"
import executeQuery from '../../lib/db'

const getTag = async (sandwichMenu) => {
    const query = `SELECT recipe_tag_table.tag_table_tag_name 
    FROM whatsub.recipe_table 
    LEFT JOIN recipe_tag_table ON recipe_table.recipe_id = recipe_tag_table.recipe_table_recipe_id 
    WHERE sandwich_table_sandwich_name = ? AND recipe_tag_table.tag_table_tag_name IS NOT NULL 
    GROUP BY recipe_tag_table.tag_table_tag_name 
    ORDER BY COUNT(*);`
    const sandwich = sandwichMenu;

    const results = await executeQuery({
        query: query,
        values: [sandwich]
    });
    if (results.length > 0) {
        console.log(results.map((item)=>item.tag_table_tag_name));
        return results.map((item)=>item.tag_table_tag_name);
    } else {
        console.log(results.err)
        return null;
    }

}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const sandwichMenu = req.query.param;
        console.log(sandwichMenu)


        try {
            const tag = await getTag(sandwichMenu)
            if (tag !== null) {
                console.log('배열'+tag)
                res.status(200).json({message:'성공',tag:tag})
            } else {
                res.status(405).json({message:'실패'})
            }
        } catch (error) {
            console.log(error)

        }




    } else if (req.method === 'POST') {
    } else {
        res.status(405).send({ message: '허용되지 않은 메서드' });
    }

}

export default handler
