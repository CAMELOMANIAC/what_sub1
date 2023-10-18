import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // PUT 요청 처리
    const { code } = req.query;
    console.log('코드:', code);

    try {
        const response = await fetch(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=http://localhost:3000/api/socialKakao&code=${code}&client_secret=${process.env.KAKAO_CLIENT_SECRET}`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
            },
        });

        const data = await response.json();
        console.log('응답 데이터:', data);

        // 쿠키 설정
        res.setHeader('Set-Cookie', `code=${data.access_token}; Path=/; HttpOnly; SameSite=Lax`);


        // 응답 보내기
        // 사용자를 다른 페이지로 리다이렉트
        res.writeHead(302, { Location: '/' });
        res.end();
    } catch (error) {
        console.error('에러:', error);
        res.status(500).json({ message: '서버 에러' });
    }
}

export default handler;