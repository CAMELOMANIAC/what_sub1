enum ErrorMessage {
	DatabaseError = 'DB와 통신에 실패하였거나 SQL에 오류가 있습니다.',
	DeleteError = '제거에 실패 했습니다.',
	NoResult = '적합한 결과가 없습니다.',
	NoLogin = '로그인이 필요 합니다.',
	NoCookie = '쿠키 정보가 없습니다.',
	NoRequest = '잘못된 요청값 입니다.',
	NoPassword = '잘못된 비밀번호 입니다.',
	UpdateError = '수정할 수 없습니다.', //일치하는 행이 없거나 이미 수정되어
	NoMethod = '허용되지 않은 메서드 입니다',
	NoAuthComplete = '인증을 완료하지 않은 회원입니다.',
	ExpiredAuth = '유효기간이 만료 되었습니다.',
}
export default ErrorMessage;
