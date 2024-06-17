import {NextApiRequest, NextApiResponse} from 'next';
import {
	checkKakaoId,
	getUserData,
	insertKakaoUserInfo,
	insertUser,
} from '../../../../utils/api/users';
import {ErrorMessage} from '../../../../utils/api/errorMessage';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const kakaoCode = req.body.kakaoCode;
	const id = req.body.id;
	const pwd = req.body.pwd;

	if (req.method === 'POST') {
		try {
			if (kakaoCode === undefined)
				throw new Error(ErrorMessage.NoRequest);
			if (typeof kakaoCode !== 'string')
				throw new Error(ErrorMessage.NoRequest);
			if (id === undefined) throw new Error(ErrorMessage.NoRequest);
			if (pwd === undefined) throw new Error(ErrorMessage.NoRequest);

			//1.아이디, 카카오 아이디 중복체크
			const checkUserId = await getUserData(id);
			if (checkUserId instanceof Error) {
				if (checkUserId.message !== ErrorMessage.NoResult) {
					throw checkUserId;
				}
			} else {
				throw new Error(ErrorMessage.NoResult);
			}

			const userId = await checkKakaoId(kakaoCode);
			if (userId instanceof Error) {
				if (userId.message !== ErrorMessage.NoResult) {
					throw userId;
				}
			} else {
				throw new Error(ErrorMessage.NoResult);
			}

			//2. 테이블에 회원정보 저장
			const saveIdpwd = await insertUser(id, pwd);
			if (saveIdpwd instanceof Error) {
				throw saveIdpwd;
			}
			const saveInfo = await insertKakaoUserInfo(id, kakaoCode);
			if (saveInfo instanceof Error) {
				throw saveInfo;
			}

			res.status(200).end();
		} catch (err) {
			if (err instanceof Error) {
				switch (err.message) {
					case ErrorMessage.NoResult:
						res.status(204).end();
						break;
					case ErrorMessage.NoRequest:
						res.status(400).end();
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
