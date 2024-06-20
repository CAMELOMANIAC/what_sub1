import {useState} from 'react';
import PasswordChangeModal from '../components/AccountModal/PasswordChangeModal';
import Head from 'next/head';
import DelectAccountModal from '../components/AccountModal/DelectAccountModal';

const Account = () => {
	const [isPasswordChange, setIsPasswordChange] = useState(false);
	const [deleteAccount, setDeleteAccount] = useState(false);

	return (
		<>
			<Head>
				<title>WhatSub : 계정 관리</title>
				<meta
					name="description"
					content="서브웨이 샌드위치 메뉴의 인기와 정보를 여기서 한눈으로 비교해보세요."
				/>
			</Head>
			<article className="w-screen sm:w-[500px] p-10 bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-lg flex flex-col justify-center items-center">
				<div className="w-full flex flex-col my-auto">
					<h1 className="font-bold text-xl mb-4">내 계정</h1>
					<button
						className="m-1 w-fit"
						onClick={() => setIsPasswordChange(true)}>
						비밀번호 변경
					</button>
					<button
						className="m-1 w-fit"
						onClick={() => setDeleteAccount(true)}>
						회원탈퇴
					</button>
				</div>
			</article>
			{isPasswordChange && (
				<PasswordChangeModal
					setIsPasswordChange={setIsPasswordChange}
				/>
			)}
			{deleteAccount && (
				<DelectAccountModal setDeleteAccount={setDeleteAccount} />
			)}
		</>
	);
};

export default Account;
