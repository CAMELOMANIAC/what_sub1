import {NextApiRequest, NextApiResponse} from 'next';
import {changePassword, checkSession} from '../../../utils/api/users';
import {isValidPassword} from '../../../utils/publicFunction';
import {ErrorMessage} from '../../../utils/api/errorMessage';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	//이 엔드포인트는 유저의 비밀번호와 관련되어 있습니다.
	if (req.method === 'PATCH') {
		const {password} = req.body;
		//비밀번호 변경
		try {
			if (req.headers.cookie) {
				const userId = await checkSession(req.headers.cookie);
				if (userId instanceof Error) {
					throw userId;
				}
				if (!isValidPassword(password)) {
					throw new Error(ErrorMessage.NoPassword);
				}
				await changePassword(userId, password);
				res.status(200).end();
			} else {
				throw new Error(ErrorMessage.NoCookie);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case ErrorMessage.UpdateError:
						res.status(204).end();
						break;
					case ErrorMessage.NoResult:
						res.status(400).json({message: err.message});
						break;
					case ErrorMessage.NoPassword:
						res.status(400).json({message: err.message});
						break;
					case ErrorMessage.NoCookie:
						res.status(400).json({message: err.message});
						break;
					case ErrorMessage.DatabaseError:
						res.status(500).end();
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
