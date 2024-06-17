import {NextApiRequest, NextApiResponse} from 'next';
import {
	checkAuthComplete,
	checkUser,
	updateSession,
} from '../../../utils/api/users';
import {ErrorMessage} from '../../../utils/api/errorMessage';

//비즈니스 로직은 함수로 만들어서 처리합니다.(함수는 utils/api/ 타입은 interfaces/api에 정의되어 있습니다)
//서비스 로직은 이곳의 핸들러 함수내에서 작성합니다

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	//이 엔드포인트는 로그인을 처리합니다
	if (req.method === 'POST') {
		const id = req.body.id;
		const pwd = req.body.pwd;

		try {
			if (!id || !pwd) {
				throw new Error(ErrorMessage.NoRequest);
			}
			const userId = await checkUser(id, pwd);
			if (userId instanceof Error) {
				throw new Error(ErrorMessage.NoPassword);
			}

			const authCheck = await checkAuthComplete(id);
			if (authCheck instanceof Error) {
				throw new Error(ErrorMessage.NoAuthComplete);
			}

			if (typeof userId === 'string') {
				const sessionId = await updateSession(userId);
				if (sessionId instanceof Error) {
					throw sessionId;
				}
				res.setHeader('Set-Cookie', [
					`session=${sessionId}; Path=/; HttpOnly; SameSite=Lax`,
					`user=${userId}; Path=/; SameSite=Lax`,
				]);
				res.status(200).json({userId: userId});
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case ErrorMessage.UpdateError:
						res.status(204).end();
						break;
					case ErrorMessage.NoRequest:
						res.status(400).json({message: err.message});
						break;
					case ErrorMessage.NoPassword:
						res.status(400).json({message: err.message});
						break;
					case ErrorMessage.NoAuthComplete:
						res.status(403).json({message: err.message});
						break;
					default:
						res.status(500).json({message: err.message});
						break;
				}
			}
		}
	} else {
		res.status(405).end();
	}
};

export default handler;
