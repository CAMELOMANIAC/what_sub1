import {NextApiRequest, NextApiResponse} from 'next';
import {userDataType} from '../../../interfaces/api/users';
import {getUsersData} from '../../../utils/api/users';

//비즈니스 로직은 함수로 만들어서 처리합니다.(함수는 utils/api/ 타입은 interfaces/api에 정의되어 있습니다)
//서비스 로직은 이곳의 핸들러 함수내에서 작성합니다

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	//이 엔드포인트는 여러명의 유저정보를 불러옵니다
	if (req.method === 'GET') {
		try {
			const results: userDataType[] | Error = await getUsersData();

			if (results instanceof Error) {
				throw results;
			} else {
				res.status(200).json(results);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case '잘못된 요청값 입니다.':
						res.status(400).json({message: err.message});
						break;
					default:
						res.status(500).json({message: err.message});
						break;
				}
			}
		}
	} else {
		// 그 외의 HTTP 메서드 처리
		res.status(405).send({message: '허용되지 않은 요청 메서드입니다'});
	}
};

export default handler;
