import { NextApiRequest, NextApiResponse } from "next";
import { replyType } from "../../../interfaces/api/recipes";
import { getReply, insertReply } from "../../../utils/api/recipes";
import { checkSession } from "../../../utils/api/users";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    //댓글 불러오기
    if (req.method === 'GET') {

        const { recipeId } = req.query;

        try {
            if (recipeId) {
                const results: replyType[] | Error = await getReply(Number(recipeId));

                if (results instanceof Error) {
                    throw results
                } else {
                    res.status(200).json(results);
                }
            } else {
                throw new Error('잘못된 요청값 입니다.')
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                switch (err.message) {
                    case '적합한 결과가 없음':
                        res.status(204).end(); break;
                    case '잘못된 요청값 입니다.':
                        res.status(400).json({ message: err.message }); break;
                    default:
                        res.status(500).json({ message: err.message }); break;
                }
            }
        }
    }
    //댓글 작성
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
                        res.status(200).end();
                    }
                }
            } else {
                throw new Error('잘못된 요청값 입니다.')
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                switch (err.message) {
                    case '일치하는 행이 없거나 이미 수정되어 수정할 수 없음':
                        res.status(204).end(); break;
                    case '잘못된 요청값 입니다.':
                        res.status(400).json({ message: err.message }); break;
                    default:
                        res.status(500).json({ message: err.message }); break;
                }
            }
        }

    } else {
        res.status(405).send({ message: '허용되지 않은 메서드' });
    }
}

export default handler;