import {NextApiRequest, NextApiResponse} from 'next';
import {changePassword, checkSession} from '../../../utils/api/users';
import {isValidPassword} from '../../../utils/publicFunction';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	//이 엔드포인트는 유저의 비밀번호와 관련되어 있습니다.
	if (req.method === 'PUT') {
		const {password} = req.body;
		//비밀번호 변경
		try {
			if (req.headers.cookie) {
				const userId = await checkSession(req.headers.cookie);
				if (userId instanceof Error) {
					throw userId;
				}
				if (!isValidPassword(password)) {
					throw new Error('비밀번호가 유효하지 않습니다.');
				}
				await changePassword(userId, password);
				res.status(200).end();
			} else {
				throw new Error('쿠키 정보가 없습니다.');
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case '일치하는 행이 없거나 이미 수정되어 수정할 수 없음':
						res.status(204).end();
						break;
					case '적합한 결과가 없음':
						res.status(400).end();
						break;
					case '비밀번호가 유효하지 않습니다.':
						res.status(400).end();
						break;
					case '쿠키 정보가 없습니다.':
						res.status(400).end();
						break;
					case 'DB와 통신 할 수 없거나 쿼리문이 잘못됨':
						res.status(500).end();
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
