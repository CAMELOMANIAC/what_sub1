import {NextApiRequest, NextApiResponse} from 'next';
import {
	checkKakaoId,
	getUserData,
	insertKakaoUserInfo,
	insertUser,
} from '../../../../utils/api/users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const kakaoCode = req.body.kakaoCode;
	const id = req.body.id;
	const pwd = req.body.pwd;

	if (req.method === 'POST') {
		try {
			if (kakaoCode === undefined)
				throw new Error('잘못된 요청값 입니다.');
			if (typeof kakaoCode !== 'string')
				throw new Error('잘못된 요청값 입니다.');
			if (id === undefined) throw new Error('잘못된 요청값 입니다.');
			if (pwd === undefined) throw new Error('잘못된 요청값 입니다.');

			//1.아이디, 카카오 아이디 중복체크
			const checkUserId = await getUserData(id);
			if (checkUserId instanceof Error) {
				if (checkUserId.message !== '적합한 결과가 없음') {
					throw checkUserId;
				}
			} else {
				throw new Error('이미 요청값이 존재합니다.');
			}

			const userId = await checkKakaoId(kakaoCode);
			if (userId instanceof Error) {
				if (userId.message !== '적합한 결과가 없음') {
					throw userId;
				}
			} else {
				throw new Error('이미 요청값이 존재합니다.');
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
					case '적합한 결과가 없음':
						res.status(204).end();
						break;
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
		res.status(405).send({message: '허용되지 않은 메서드입니다'});
	}
};

export default handler;
