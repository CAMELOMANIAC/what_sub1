import {useEffect, useState} from 'react';

/**
 *모달 애니메이션 상태를 관리하는 커스텀 후크입니다.
 * @param {Function} setIsModalStateChange - 모달 on/off상태를 변경하는 함수입니다. 애니메이션 종료 후 자동으로 false로 변경됩니다.
 * @returns {Object} isLoaded - 애니메이션 로드 상태를 나타내는 boolean 값입니다. setIsLoaded - 애니메이션 로드 상태를 변경하는 함수입니다. 이 함수로 애니메이션을 호출하거나 종료할 수 있습니다.
 */
const useModalAnimationHook = (
	setIsModalStateChange: (arg: boolean) => void,
) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
		setIsAnimating(true);
	}, []);

	useEffect(() => {
		if (!isLoaded && isAnimating) {
			setTimeout(() => {
				setIsModalStateChange(false);
			}, 500);
		}
	}, [isAnimating, isLoaded, setIsModalStateChange]);

	return {isLoaded, setIsLoaded};
};

export default useModalAnimationHook;
