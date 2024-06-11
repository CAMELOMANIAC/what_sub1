/*만약 페이지에서 사용자가 진짜 사용자가 맞는지 식별할때 사용
getServerSideProps함수 내부에 사용해야하고 매개변수 쿠키는 const cookie = req.headers.cookie;을 받아야함
그리고 sessionCheck를 출력함으로 페이지 컴포넌트의 props에 할당하면 페이지컴포넌트내에서 값을 사용할수있음
세션이 일치하면 true 아니면 false를 반환함

export async function getServerSideProps({ req }) {
    const cookie = req.headers.cookie;
    const sessionCheck = await checkSession(cookie);

    return {
        props: {
            sessionCheck,
        },
    };
} 
const Pages = ({sessionCheck}) => {

}
*/
export async function checkSession(cookie: string) {
	try {
		if (cookie) {
			const options = {
				method: 'GET',
				headers: {
					Cookie: cookie,
				},
				credentials: 'include' as const,
			};
			const res = await fetch(
				process.env.URL + '/api/users/session',
				options,
			);

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			const sessionCheck = await res.json();
			return sessionCheck;
		}
		return null;
	} catch (error) {
		return null;
	}
}
