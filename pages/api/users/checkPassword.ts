import {NextApiRequest, NextApiResponse} from 'next';
import {checkSession, getPassword} from '../../../utils/api/users';
import ErrorMessage from '../../../utils/api/errorMessage';

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
					throw new Error(ErrorMessage.NoPassword);
				}
				res.status(200).end();
			} else {
				throw new Error(ErrorMessage.NoCookie);
			}
		} catch (error) {
			if (error instanceof Error) {
				switch (error.message) {
					case ErrorMessage.NoResult:
						res.status(400).json({message: error.message});
						break;
					case ErrorMessage.NoCookie:
						res.status(400).json({message: error.message});
						break;
					case ErrorMessage.NoPassword:
						res.status(400).json({message: error.message});
						break;
					default:
						res.status(500).end();
						break;
				}
			}
		}
	} else {
		res.status(405).end();
	}
};

export default handler;
