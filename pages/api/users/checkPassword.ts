import {NextApiRequest, NextApiResponse} from 'next';
import {checkSession, getPassword} from '../../../utils/api/users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	//이 엔드포인트는 비밀번호 일치여부를 확인합니다.
	if (req.method === 'POST') {
		const {password} = req.body;
		try {
			if (req.headers.cookie) {
				const userId = await checkSession(req.headers.cookie);
				if (userId instanceof Error) {
					throw userId;
				}
				const serverPassword = await getPassword(userId);
				if (String(password) !== serverPassword[0].user_pwd) {
					throw new Error('비밀번호가 일치하지 않습니다.');
				}
				res.status(200).end();
			} else {
				throw new Error('쿠키 정보가 없습니다.');
			}
		} catch (error) {
			if (error instanceof Error) {
				switch (error.message) {
					case '적합한 결과가 없음':
						res.status(400).end();
						break;
					case '쿠키 정보가 없습니다.':
						res.status(400).end();
						break;
					case '비밀번호가 일치하지 않습니다.':
						res.status(401).end();
						break;
					default:
						res.status(500).end();
						break;
				}
			}
		}
	} else {
		res.status(405).send({message: '허용되지 않은 요청 메서드입니다'});
	}
};

export default handler;
