import {RefObject, useEffect} from 'react';

const useAnimation = (
	ref: RefObject<HTMLDivElement>,
	isValid: (id: unknown) => boolean,
	id: unknown,
	animationName = 'vibration 0.1s infinite',
) => {
	useEffect(() => {
		if (!isValid(id) && ref.current) {
			ref.current.style.animation = animationName;
			const timeoutId = setTimeout(() => {
				if (ref.current) ref.current.style.animation = '';
			}, 300);

			return () => {
				clearTimeout(timeoutId);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);
};

export default useAnimation;
