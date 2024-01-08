import { NextApiRequest, NextApiResponse } from "next";
import { replyType } from "../../../interfaces/api/recipes";
import { getReply, insertReply } from "../../../utils/api/recipes";
import { checkSession } from "../../../utils/api/users";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'GET') {

        const { recipeId } = req.query;

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
    }
    else if (req.method === 'POST') {

        const recipeId = Number(req.body.recipeId);
        const content = req.body.content;

        try {
            if (req.headers.cookie && recipeId) {
                const userId = await checkSession(req.headers.cookie);

                if (typeof userId === 'string') {
                    const results: replyType[] | Error = await insertReply(content, recipeId, userId);

                    if (results instanceof Error) {
                        throw results
                    } else {
                        res.status(200).json({message:'댓글 등록 성공'});
                    }
                }
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