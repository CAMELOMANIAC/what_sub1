import { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '../../../lib/mail';
import { isValidEmail, isValidId, isValidPassword } from '../../../utils/publicFunction';
import { getEmail, getUserData, insertUser, insertUserInfo } from '../../../utils/api/users';
import { v4 as uuidv4 } from 'uuid';


//회원가입 로직
//0. 인증을 완료하지 않고 기한이 만료된 유저정보가 있을경우 미리 제거(만료기한을 기준으로)
//1. 아이디,이메일 중복체크
//2. 테이블에 회원정보 저장
//3. 인증메일 발송-----여기까지 register 엔드포인트로 구현

//4. 인증번호와 만료기한 체크-----여기서부터는 authCheck 엔드포인트에서
//5. 인증성공시 DB수정
//6. 실패시 생성되었던 DB제거(인증번호를 기준으로)
//7. 로그인

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const id = req.body.id;
        const pwd = req.body.pwd;
        const email = req.body.email;

        try {
            if (!id || !pwd || !email) {
                throw new Error('잘못된 요청값 입니다.');
            }
            if (!isValidId(id))
                throw new Error('잘못된 요청값 입니다.');
            if (!isValidPassword(id))
                throw new Error('잘못된 요청값 입니다.');
            if (!isValidEmail(email))
                throw new Error('잘못된 요청값 입니다.');

            const authNumber = uuidv4();
            const mailOptions = {
                from: process.env.MAIL_ID!,
                to: email,
                subject: 'whatsub 가입 인증 메일입니다',
                text: `아래 하이퍼링크가 보이지 않는다면, url을 주소창에 입력하여 주세요. 입력시 인증이 완료됩니다 ${process.env.URL + '/AuthRedirect?authNumber=' + authNumber}`,
                html: `<a href='${process.env.URL + '/AuthRedirect?authNumber=' + authNumber}'>인증 완료하기.</a>`
            };

            //1.아이디, 이메일 중복체크
            const checkUserId = await getUserData(id);
            if (checkUserId instanceof Error) {
                if (checkUserId.message !== '적합한 결과가 없음') {
                    throw checkUserId;
                }
            }else{
                throw new Error('이미 요청값이 존재합니다.');
            }

            const checkUserEmail = await getEmail(id);
            if (checkUserEmail instanceof Error) {
                if (checkUserEmail.message !== '적합한 결과가 없음') {
                    throw checkUserEmail
                }
            }else{
                throw new Error('이미 요청값이 존재합니다.');
            }

            //2. 테이블에 회원정보 저장
            const saveIdpwd = await insertUser(id, pwd);
            if (saveIdpwd instanceof Error) {
                throw saveIdpwd
            }
            const saveInfo = await insertUserInfo(id, authNumber, email);
            if (saveInfo instanceof Error) {
                throw saveInfo
            }

            //3.인증메일 발송
            const result = await sendMail(mailOptions);
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
                    case '이미 요청값이 존재합니다.':
                        res.status(409).json({ message: err.message }); break;
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