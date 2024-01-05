import { NextApiRequest, NextApiResponse } from "next";
import { replyType } from "../../../interfaces/api/recipes";
import { getReply } from "../../../utils/api/recipes";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { recipeId } = req.query;

    if (req.method === 'GET') {

        try {
            const results: replyType[] | Error = await getReply(Number(recipeId));

            if (results instanceof Error) {
                throw results
            } else {
                res.status(200).json(results);
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).json({ statusCode: 500, message: err.message });
            }
        }

    } else {
        res.status(405).send({ message: '허용되지 않은 메서드' });
    }
}

export default handler;