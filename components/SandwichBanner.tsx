import { useRef, useEffect } from 'react';

const SandwichBanner = () => {
    const sandwichRef: { current: HTMLCanvasElement | null } = useRef(null);

    useEffect(() => {
        const context = sandwichRef.current ? sandwichRef.current.getContext('2d') : null; // 그래픽 렌더링 컨텍스트 가져오기

        if (context) { // context가 null이 아닌 경우에만 이미지 로딩 및 그리기 수행
            const image = new Image();

            image.onload = () => {
                if (sandwichRef.current) {
                    const canvas = sandwichRef.current;
                    const rect = canvas.getBoundingClientRect();

                    // CSS 픽셀 단위로 캔버스 크기 설정
                    canvas.style.width = `${rect.width}px`;
                    canvas.style.height = `${rect.height}px`;

                    // 디바이스 픽셀 비율 조정
                    const scale = window.devicePixelRatio;
                    canvas.width = rect.width * scale;
                    canvas.height = rect.height * scale;

                    context.scale(scale, scale);
                    context.drawImage(image, 0, 0, rect.width, rect.height);

                    const clickListener = (event) => {
                        const x = event.clientX - rect.left;
                        const y = event.clientY - rect.top;

                        //context.clearRect(x, y, 10 / scale, 10 / scale);
                        context.save();
                        context.beginPath();
                        context.arc(x, y, 30, 0, Math.PI * 2);
                        context.clip();
                        context.clearRect(0, 0, rect.width * scale, rect.height * scale);
                        context.restore();
                        console.log('지워짐');
                    };

                    const moveListener = (event) => {
                        const x = event.clientX - rect.left;
                        const y = event.clientY - rect.top;

                        const dx = x - rect.width / 2;
                        const dy = y - rect.height / 2;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2));
                        const scale = 1 + (distance / maxDistance) * 0.1;
                        canvas.style.transform = `scale(${scale})`;
                        canvas.style.transition = 'transform 0.5s ease-out';

                    }

                    const outListener = () => {
                        canvas.style.transform = `scale(1, 1)`;
                        canvas.style.transition = 'transform 0.5s ease-out';
                    }

                    canvas.addEventListener('mouseup', clickListener);
                    canvas.addEventListener('mousemove', moveListener);
                    canvas.addEventListener('mouseout', outListener);

                    return () => {
                        canvas.removeEventListener('mouseup', clickListener);
                        canvas.removeEventListener('mousemove', moveListener);
                        canvas.removeEventListener('mouseout', outListener);
                    };

                }
            };

            image.src = '/images/front_banner.png';
        }
    }, []);

    return (
        <canvas ref={sandwichRef} className='mx-auto w-80 h-80 animate-customBounce'>
            <img src="/images/front_banner.png" alt="subway" className='mx-auto w-80' />
        </canvas>
    );
};

export default SandwichBanner;