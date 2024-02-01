import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'POST') {
        try {
            
        } catch (err) {
            if (err instanceof Error) {
                switch (err.message) {
                    case '적합한 결과가 없음':
                        res.status(204).end(); break;
                    case '쿠키 정보가 없습니다.':
                        res.status(400).json({ message: err.message }); break;
                    case '잘못된 요청값 입니다.':
                        res.status(400).json({ message: err.message }); break;
                    default:
                        res.status(500).json({ message: err.message }); break;
                }
            }
        }
    } else {
        res.status(405).send({ message: '허용되지 않은 메서드입니다' });
    }
}

export default handler;