import {useRef, useEffect, useState} from 'react';

const SandwichBanner = () => {
	const sandwichRef: {current: HTMLCanvasElement | null} = useRef(null);
	const [forkPosition, setForkPosition] = useState({x: 0, y: -100, angle: 0});

	useEffect(() => {
		const context = sandwichRef.current
			? sandwichRef.current.getContext('2d')
			: null; // 그래픽 렌더링 컨텍스트 가져오기

		if (context) {
			// context가 null이 아닌 경우에만 이미지 로딩 및 그리기 수행
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

					///이미지 체크 그리드
					// 그리드의 갯수를 설정합니다.
					const rows = 5; // 행 수
					const cols = 5; // 열 수

					// 그리드의 크기를 계산합니다.
					const gridWidth = parseInt(canvas.style.width) / cols;
					const gridHeight = parseInt(canvas.style.height) / rows;

					// 결과를 저장할 배열을 생성합니다.
					const gridValues: boolean[][] = [];

					// 각 그리드에 대해 확인합니다.
					for (let i = 0; i < rows; i++) {
						const row: boolean[] = [];
						for (let j = 0; j < cols; j++) {
							const x = j * gridWidth;
							const y = i * gridHeight;

							// 해당 그리드의 이미지 데이터를 가져옵니다.
							const imageData = context.getImageData(
								x,
								y,
								gridWidth,
								gridHeight,
							);

							// 이미지 데이터에 어떤 처리를 하거나 체크합니다.
							let isEmpty = true;
							for (let k = 0; k < imageData.data.length; k += 4) {
								if (imageData.data[k + 3] !== 0) {
									isEmpty = false;
									break;
								}
							}
							// 결과를 배열에 추가합니다.
							row.push(isEmpty);
						}
						gridValues.push(row);
					}
					/*
                                        console.log(gridValues);
                                        //이미지 그리드 육안확인용
                                        if (context) {
                                            // 이미지 그리기
                                            context.drawImage(image, 0, 0, rect.width, rect.height);
                    
                                            // 그리드 그리기
                                            for (let i = 0; i <= cols; i++) {
                                                const x = i * gridWidth;
                                                context.moveTo(x, 0);
                                                context.lineTo(x, rect.height * scale);
                                            }
                    
                                            for (let i = 0; i <= rows; i++) {
                                                const y = i * gridHeight;
                                                context.moveTo(0, y);
                                                context.lineTo(rect.width * scale, y);
                                            }
                    
                                            // 그리드 색상 채우기
                                            for (let i = 0; i <= cols; i++) {
                                                for (let j = 0; j <= rows; j++) {
                                                    if (gridValues[j] && gridValues[j][i] === false) {
                                                        const x = i * gridWidth;
                                                        const y = j * gridHeight;
                                                        context.fillStyle = 'rgba(2, 255, 255, 0.5)';
                                                        context.fillRect(x, y, gridWidth, gridHeight);
                                                    }
                                                }
                                            }
                                            context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                                            context.stroke();
                                        }*/

					const clickListener = event => {
						const x = event.clientX - rect.left;
						const y = event.clientY - rect.top;

						// 클릭한 위치를 그리드의 좌표로 변환
						const gridX = Math.floor(x / gridWidth);
						const gridY = Math.floor(y / gridHeight);
						// 현재 위치와 주변 위치의 값 확인
						const currentCell =
							gridValues[gridY] && gridValues[gridY][gridX];
						const leftCell =
							gridValues[gridY] && gridValues[gridY][gridX - 1];
						const rightCell =
							gridValues[gridY] && gridValues[gridY][gridX + 1];
						const upCell =
							gridValues[gridY - 1] &&
							gridValues[gridY - 1][gridX];
						const downCell =
							gridValues[gridY + 1] &&
							gridValues[gridY + 1][gridX];

						// 현재 위치가 false이면서 상하좌우 중 하나가 true일 때만 동작
						if (
							currentCell === false &&
							(leftCell ||
								rightCell ||
								upCell ||
								downCell ||
								!gridValues[gridY] ||
								gridX === 0 ||
								gridX === cols - 1)
						) {
							context.save();
							context.beginPath();
							context.arc(x, y, 30, 0, Math.PI * 2);
							context.clip();
							context.clearRect(
								0,
								0,
								rect.width * scale,
								rect.height * scale,
							);
							context.restore();

							// 클릭 후에도 해당 위치의 이미지 데이터 확인
							const imageData = context.getImageData(
								gridX * gridWidth,
								gridY * gridHeight,
								gridWidth,
								gridHeight,
							);

							let isEmpty = true;
							for (let k = 0; k < imageData.data.length; k += 4) {
								if (imageData.data[k + 3] !== 0) {
									isEmpty = false;
									break;
								}
							}

							// 결과를 배열에 업데이트
							gridValues[gridY][gridX] = isEmpty;
						}
					};
					canvas.addEventListener('mouseup', clickListener);

					const mouseMoveListener = event => {
						const x = event.clientX - rect.left;
						const y = event.clientY - rect.top;

						const gridX = Math.floor(x / gridWidth);
						const gridY = Math.floor(y / gridHeight);

						const currentCell =
							gridValues[gridY] && gridValues[gridY][gridX];
						const leftCell =
							gridValues[gridY] && gridValues[gridY][gridX - 1];
						const rightCell =
							gridValues[gridY] && gridValues[gridY][gridX + 1];
						const upCell =
							gridValues[gridY - 1] &&
							gridValues[gridY - 1][gridX];
						const downCell =
							gridValues[gridY + 1] &&
							gridValues[gridY + 1][gridX];

						if (
							currentCell === false &&
							(leftCell ||
								rightCell ||
								upCell ||
								downCell ||
								!gridValues[gridY] ||
								gridX === 0 ||
								gridX === cols - 1)
						) {
							const centerX = (rect.width * scale) / 2; // 캔버스의 중앙 x 좌표
							const centerY = (rect.height * scale) / 2; // 캔버스의 중앙 y 좌표
							const angle = Math.atan2(y - centerY, x - centerX);

							setForkPosition({x, y, angle});
						} else {
							setForkPosition({x: 0, y: -100, angle: 0});
						}
					};

					canvas.addEventListener('mousemove', mouseMoveListener);

					return () => {
						canvas.removeEventListener('mouseup', clickListener);
						canvas.removeEventListener(
							'mousemove',
							mouseMoveListener,
						);
					};
				}
			};

			image.src = '/images/front_banner.png';
		}
	}, []);

	return (
		<div className="relative w-full h-full">
			<canvas ref={sandwichRef} className="mx-auto w-80 h-80"></canvas>
			{forkPosition && (
				<img
					src="/images/fork.png"
					alt="fork"
					className="sm:block hidden"
					style={{
						position: 'absolute',
						top: forkPosition.y,
						left: forkPosition.x + 300,
						pointerEvents: 'none',
						transform: `rotate(${forkPosition.angle + 180}rad)`,
						transformOrigin: 'top center', // 회전 중심점을 이미지 중앙으로 설정
						transition: 'top 1s, left 1s, transform 1s',
						scale: '0.4',
					}}
				/>
			)}
		</div>
	);
};

export default SandwichBanner;
