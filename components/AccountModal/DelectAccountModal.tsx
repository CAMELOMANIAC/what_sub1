import React, {useState} from 'react';
import MediumModal from '../interface/MediumModal';
import useModalAnimationHook from '../../utils/modalAnimationHook';
import {useQuery} from 'react-query';
import Image from 'next/image';

type propsType = {
	setDeleteAccount: (arg: boolean) => void;
};
const DelectAccountModal = ({setDeleteAccount}: propsType) => {
	const {isLoaded, setIsLoaded} = useModalAnimationHook(setDeleteAccount);
	const [isCheck, setIsCheck] = useState<boolean>(false);

	const [PrevPwd, setPrevPwd] = useState<string>('');
	const handleChangePrevPwd = e => {
		setPrevPwd(e.target.value);
	};

	const checkPasswordQuery = async () => {
		const result = await fetch('/api/users/checkPassword', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				included: 'true',
			},
			body: JSON.stringify({password: PrevPwd}),
		});
		if (result.ok) {
			return result;
		} else {
			switch (result.status) {
				case 400:
					throw new Error('잘못된 입력값 입니다');
				case 500:
					throw new Error('서버와 통신 할 수 없습니다');
				default:
					throw new Error('비밀번호가 일치하지 않습니다');
			}
		}
	};
	const {refetch} = useQuery('checkPassword', checkPasswordQuery, {
		enabled: false,
		retry: false,
		onError: (error: Error) => {
			alert(error.message);
		},
		onSuccess: () => {
			setIsCheck(true);
		},
	});

	return (
		<MediumModal setIsLoaded={setIsLoaded} isLoaded={isLoaded}>
			<div className="flex flex-col justify-center items-center m-auto">
				<h2 className="font-bold text-lg mr-auto">회원 탈퇴</h2>
				<Image
					src="/images/샌드위치_파쇄.png"
					alt="accountDelete"
					width={200}
					height={200}
					className="m-2 mt-4"
				/>
				<div className="flex flex-row justify-center items-center">
					<section
						className={`${isCheck ? 'max-w-0' : 'max-w-[500px]'} w-full h-full overflow-hidden transition-all duration-500 ease-in-out`}>
						<div className="m-2 w-[300px] flex flex-col justify-center items-center">
							<p className="mb-4 text-gray-600">
								본인 확인을 위해 비밀번호를 입력해주세요
							</p>
							<label
								htmlFor="prevUserPwd"
								className="block text-sm mr-auto">
								비밀번호
							</label>
							<input
								className="border-2 w-[300px] h-10 m-2 rounded"
								onChange={handleChangePrevPwd}
								type="password"
								id="prevUserPwd"
								placeholder="비밀번호"></input>
							<button
								className="font-semibold ml-auto"
								onClick={() => refetch()}>
								다음
							</button>
						</div>
					</section>
					<section
						className={`${isCheck ? 'max-w-[500px]' : 'max-w-0'} w-full h-full overflow-hidden transition-all duration-500 ease-in-out`}>
						<div className="m-2 w-[300px] flex flex-col justify-center items-center">
							<p className="mb-4 text-gray-600">
								정말 탈퇴하시겠습니까?
								<br />
								탈퇴시 모든 정보가 삭제되며 되돌릴 수 없습니다.
							</p>
							<button className="text-red-600 ml-auto">
								탈퇴하기
							</button>
						</div>
					</section>
				</div>
			</div>
		</MediumModal>
	);
};
export default DelectAccountModal;
