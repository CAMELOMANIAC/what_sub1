import { NextApiRequest, NextApiResponse } from 'next'
import { getUserData } from '../../../utils/api/users';
import { userDataType } from '../../../interfaces/api/users';


//비즈니스 로직은 함수로 만들어서 처리합니다.(함수는 utils/api/ 타입은 interfaces/api에 정의되어 있습니다)
//서비스 로직은 이곳의 핸들러 함수내에서 작성합니다
//ui로직(인코딩된 문자열을 요청값으로 전달하고 json객체로 응답값을 받습니다) - 
//서비스로직(인코딩된 문자열을 각 비즈니스 로직 함수에 맞는 타입으로 변환하고 전달합니다 비즈니스로직이 반환한 값(값 및 에러객체)를 ui로직에게 json객체로 전달합니다) - 
//비즈니스로직(변환된 값을 받아서 db와 통신하고 반환한 값(값 및 에러객체)을 다시 비즈니스로직에게 전달합니다) -

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query

    //이 엔드포인트는 한명의 유저정보를 불러옵니다
    if (req.method === 'GET') {
        if (typeof id === 'string') {
            try {
                const results: userDataType[] | Error = await getUserData(id)
                if (results instanceof Error) {
                    res.status(500).json({ statusCode: 500, message: results.message });
                } else {
                    res.status(200).json(results);
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    res.status(500).json({ statusCode: 500, message: err.message });
                }
            }
        } else {
            res.status(500).json({ statusCode: 500, message: '응답받은 id값이 잘못된 형식입니다' });
        }

    } else if (req.method === 'POST') {
        // POST 요청 처리

    } else {
        // 그 외의 HTTP 메서드 처리
        res.status(405).send({ message: '허용되지 않은 요청 메서드입니다' });
    }
}



export default handler