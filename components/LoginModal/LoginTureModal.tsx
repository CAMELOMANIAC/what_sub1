import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {deleteCookie} from '../../utils/publicFunction';
import {useMutation} from 'react-query';
import {useDispatch} from 'react-redux';
import {actionSetLogoutData} from '../../redux/reducer/userReducer';
import {PiHeartStraightFill} from 'react-icons/pi';
import {RiPencilFill} from 'react-icons/ri';
import {FaGear} from 'react-icons/fa6';
import {IoLogOut} from 'react-icons/io5';
import Link from 'next/link';
import {useRouter} from 'next/router';

type BubbleTailProps = {
	$tailRight?: string;
};

const BubbleTail = styled.div<BubbleTailProps>`
	&:after {
		content: '';
		position: absolute;
		border-style: solid;
		border-width: 0 15px 15px;
		border-color: white transparent;
		display: block;
		width: 0;
		top: -15px;
		right: ${props => props.$tailRight || 'auto'};
	}
	&::before {
		content: '';
		position: absolute;
		border-style: solid;
		border-width: 0 15px 15px;
		border-color: rgb(229 231 235) transparent;
		display: block;
		width: 0;
		z-index: 0;
		top: -16.5px;
		right: ${props => props.$tailRight || 'auto'};
	}
`;

const LoginTureModal = ({
	handleClose,
	buttonRef,
}: {
	handleClose: (arg: boolean) => void;
	buttonRef: HTMLButtonElement;
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [tailRight, setTailRight] = useState<string>('auto'); //tailLeft값을 상태값으로 설정
	const dispatch = useDispatch();
	const router = useRouter();

	//모달창 외부 클릭시 모달창 닫기
	useEffect(() => {
		const handleOutSideClick = e => {
			if (ref.current && !ref.current.contains(e.target)) {
				//contains 함수는 인자로 전달된 노드가 해당 노드의 자손인지 판단
				handleClose(false);
			}
		};
		document.addEventListener('mousedown', handleOutSideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutSideClick);
		};
	}, [handleClose]);

	//모달 위치 설정
	useEffect(() => {
		const rect = buttonRef.getBoundingClientRect();

		if (ref.current) {
			//모달 위치 설정
			ref.current.style.top = `${rect.bottom + 15}px`;
			setTailRight(`${rect.width / 2 - 15}px`);
		}
	}, [buttonRef]);

	//로그아웃 요청
	const logoutMutation = useMutation(
		'user',
		async () => {
			fetch('/api/users/deleteCookie', {method: 'POST'});
		},
		{
			onSuccess: () => {
				deleteCookie('user');
				handleClose(false);
				dispatch(actionSetLogoutData());
				router.push('/');
			},
		},
	);

	const logoutHandler = () => {
		logoutMutation.mutate();
	};

	const AccountHandler = () => {
		router.push('/Account');
		handleClose(false);
	};

	return (
		<BubbleTail
			ref={ref}
			className="absolute w-max right-2 bg-white border p-5 text-end"
			$tailRight={tailRight}>
			<ul className="text-sm">
				<li>
					<Link href={'/Recipes?write'}>
						내가 쓴 글
						<RiPencilFill className="inline-block ml-2 text-gray-600" />
					</Link>
				</li>
				<li>
					<Link href={'/Recipes?favorite'}>
						내가 남긴 좋아요
						<PiHeartStraightFill className="inline-block ml-2 text-gray-600" />
					</Link>
				</li>
				<li>
					<button onClick={AccountHandler}>
						계정 관리
						<FaGear className="inline-block ml-2 text-gray-600" />
					</button>
				</li>
				<li>
					<button onClick={() => logoutHandler()}>
						로그아웃
						<IoLogOut className="inline-block ml-2 text-gray-600" />
					</button>
				</li>
			</ul>
		</BubbleTail>
	);
};

export default LoginTureModal;
