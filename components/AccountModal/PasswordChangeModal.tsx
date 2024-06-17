import {useRef, useState} from 'react';
import useModalAnimationHook from '../../utils/modalAnimationHook';
import {isValidPassword} from '../../utils/publicFunction';
import useAnimation from '../../utils/animationHook';
import {useMutation, useQuery} from 'react-query';
import MediumModal from '../interface/MediumModal';
import Image from 'next/image';

type propsType = {
	setIsPasswordChange: (arg: boolean) => void;
};

const PasswordChangeModal = ({setIsPasswordChange}: propsType) => {
	const {isLoaded, setIsLoaded} = useModalAnimationHook(setIsPasswordChange);
	const [isCheck, setIsCheck] = useState<boolean>(false);

	const [PrevPwd, setPrevPwd] = useState<string>('');
	const [pwd, setPwd] = useState<string>('');
	const [checkPwd, setCheckPwd] = useState<string>('');
	const handleChangePrevPwd = e => {
		setPrevPwd(e.target.value);
	};
	const handleChangeCheckPwd = e => {
		setCheckPwd(e.target.value);
	};
	const handleChangePwd = e => {
		setPwd(e.target.value);
	};

	const alertPwdRef = useRef<HTMLDivElement>(null);
	useAnimation(alertPwdRef, isValidPassword, pwd);
	const alertCheckPwdRef = useRef<HTMLDivElement>(null);
	useAnimation(alertCheckPwdRef, () => pwd === checkPwd, checkPwd);

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

	const changePassword = async () => {
		const result = await fetch('/api/users/changePassword', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				included: 'true',
			},
			body: JSON.stringify({password: pwd}),
		});
		if (result.ok) {
			return result;
		} else {
			switch (result.status) {
				case 400:
					throw new Error('잘못된 입력값입니다');
				case 401:
					throw new Error('인증되지 않은 사용자 입니다');
				case 500:
					throw new Error('서버와 통신 할 수 없습니다');
				default:
					throw new Error('비밀번호 변경에 실패하였습니다');
			}
		}
	};
	const changePasswordMutate = useMutation('changePassword', changePassword, {
		onSuccess: () => {
			setIsLoaded(false);
			alert('비밀번호가 변경되었습니다');
		},
		onError: (error: Error) => {
			alert(error.message);
		},
	});

	return (
		<MediumModal setIsLoaded={setIsLoaded} isLoaded={isLoaded}>
			<div className="flex flex-col justify-center items-center m-auto">
				<h2 className="font-bold text-lg mr-auto">비밀번호 변경</h2>
				<Image
					src="/images/샌드위치_소금.png"
					alt="accountDelete"
					width={150}
					height={150}
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
							<label
								htmlFor="userPwd"
								className="block text-sm mr-auto">
								비밀번호
							</label>
							<input
								className="border-2 w-[300px] h-10 m-2 rounded"
								onChange={handleChangePwd}
								type="password"
								id="userPwd"
								placeholder="비밀번호"></input>
							{!isValidPassword(pwd) && (
								<p
									className="text-red-600 text-sm"
									ref={alertPwdRef}>
									1~15사이의 문자여야만 합니다.
								</p>
							)}
						</div>

						<div className="m-2 w-[300px] flex flex-col justify-center items-center">
							<label
								htmlFor="checkUserPwd"
								className="block text-sm mr-auto">
								비밀번호 확인
							</label>
							<input
								className="border-2 w-[300px] h-10 m-2 rounded"
								onChange={handleChangeCheckPwd}
								type="password"
								id="checkUserPwd"
								placeholder="비밀번호 확인"></input>
							{checkPwd !== pwd && (
								<p
									className="text-red-600 text-sm"
									ref={alertCheckPwdRef}>
									비밀번호와 일치하지 않습니다
								</p>
							)}
							<button
								className={`${!(pwd === checkPwd) && 'text-gray-400'} font-semibold ml-auto`}
								onClick={() =>
									pwd === checkPwd &&
									changePasswordMutate.mutate()
								}>
								변경하기
							</button>
						</div>
					</section>
				</div>
			</div>
		</MediumModal>
	);
};
export default PasswordChangeModal;
