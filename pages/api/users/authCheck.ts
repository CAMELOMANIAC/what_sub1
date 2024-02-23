import { NextApiRequest, NextApiResponse } from 'next'
import { checkAuth, updateUserInfo, getExpiredAuth, deleteUser, deleteUserInfo } from '../../../utils/api/users';

//회원가입 로직
//0. 인증을 완료하지 않고 기한이 만료된 유저정보가 있을경우 미리 제거(만료기한을 기준으로)
//1. 아이디,이메일 중복체크
//2. 테이블에 회원정보 저장
//3. 인증메일 발송-----여기까지 register 엔드포인트로 구현

//4. 인증번호와 만료기한 체크-----여기서부터는 authCheck 엔드포인트에서
//5. 실패시 생성되었던 DB제거(인증번호를 기준으로)
//6. 인증성공시 DB수정

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'PUT') {
        const authNumber = req.query.authNumber;

        try {
            if (typeof authNumber !== 'string') {
                throw new Error('잘못된 요청값 입니다.');
            }

            //4. 인증번호와 만료기한 체크
            const response = await checkAuth(authNumber);
            if (response instanceof Error) {
                throw response
            }
            
            //5. 실패시 생성되었던 DB제거(인증번호를 기준으로)
            const expiredAuth = await getExpiredAuth(authNumber);
            if (!(expiredAuth instanceof Error)){
                const deleteUserInfoResult = await deleteUserInfo(expiredAuth);
                const deleteUserResult = await deleteUser(expiredAuth);
                console.log(deleteUserInfoResult, deleteUserResult);
            }

            //6. 인증성공시 DB수정
            const result = await updateUserInfo(authNumber);
            if (result instanceof Error) {
                throw result
            }

            res.status(200).end();
        } catch (err: unknown) {
            if (err instanceof Error) {
                switch (err.message) {
                    case '적합한 결과가 없음':
                        res.status(204).end(); break;
                    case '잘못된 요청값 입니다.':
                        res.status(400).json({ message: err.message }); break;
                    case '유효기간이 만료 되었습니다.':
                        res.status(408).json({ message: err.message }); break;
                    default:
                        res.status(500).json({ message: err.message }); break;
                }
            }
        }
    } else {
        res.status(405).send({ message: '허용되지 않은 메서드입니다' });
    }
}


export default handler