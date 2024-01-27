import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',  // 메일 서비스 제공자
    auth: {
        user: process.env.MAIL_ID,  // 사용자의 이메일 주소
        pass: process.env.MAIL_PASSWORD  // 사용자의 이메일 비밀번호
    }
});

type mailOptionsType = {
    from: string, // 발신자 이메일 주소
    to: string, // 수신자 이메일 주소
    subject: string, // 메일 제목
    text: string, // 텍스트 본문
    html?: string //html 태그지원하는 이메일 제공자는 html요소로 보여줄 수 도있음
}
//일 500회까지만 가능

export const sendMail = async (mailOptions:mailOptionsType) => {
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        return new Error(error)
    }
}