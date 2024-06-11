import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';

const AuthRedirect = () => {
	const router = useRouter();
	const [notice, setNotice] = useState<string>(
		'인증 완료 문구가 뜰때까지 기다려주세요',
	);

	useEffect(() => {
		const authNumber = router.query.authNumber;
		const fetchRegister = async () => {
			try {
				const response = await fetch(
					`api/users/authCheck?authNumber=${authNumber}`,
					{
						method: 'PUT',
					},
				);
				if (response.status === 200) {
					setNotice('인증이 완료 되었습니다.');
				} else {
					switch (response.status) {
						case 400:
							setNotice('잘못된 요청값 입니다.');
							break;
						case 408:
							setNotice('유효기간이 만료 되었습니다.');
							break;
						case 204:
							setNotice(
								'인증번호가 잘못되었거나 유효기간이 만료되어 사용할 수 없습니다',
							);
							break;
						default:
							setNotice('인증이 실패 했습니다.');
							break;
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
		if (typeof authNumber !== 'undefined') {
			fetchRegister();
		}
	}, [router.isReady, router.query.authNumber]);

	return (
		<>
			<Head>
				<meta name="robots" content="noindex" />
			</Head>
			<div>
				{notice}
				{notice === '인증이 완료 되었습니다.' && (
					<Link href={'/'}>홈으로가기</Link>
				)}
			</div>
		</>
	);
};

export default AuthRedirect;
