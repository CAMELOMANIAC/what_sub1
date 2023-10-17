import { NextApiRequest, NextApiResponse } from 'next';
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'PUT') {
    // PUT 요청 처리
    const { code } = req.body;

    // 쿠키 설정
    res.setHeader('Set-Cookie', `code=${code}; Path=/; HttpOnly; SameSite=Lax`);
    // 응답 보내기
    res.status(200).json({ message: '쿠키 저장 성공' });
  } 
}

export default handler