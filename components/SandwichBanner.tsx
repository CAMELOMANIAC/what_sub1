import { useRef, useEffect, useState } from 'react';

const SandwichBanner = () => {
    const sandwichRef = useRef<HTMLCanvasElement | null>(null);
    const [forkPosition, setForkPosition] = useState({ x: 0, y: -100, angle: 0 });


    useEffect(() => {
        const canvas = sandwichRef.current;
        const context = canvas && canvas.getContext('2d');
        if (!context) return;
        const image = new Image();

        const handleImageLoad = () => {
            const rect = canvas.getBoundingClientRect();

            // 캔버스 크기 설정
            const scale = window.devicePixelRatio;
            canvas.width = rect.width * scale;
            canvas.height = rect.height * scale;

            context.scale(scale, scale);
            context.drawImage(image, 0, 0, rect.width, rect.height);

            // 그리드 설정
            const rows = 5;
            const cols = 5;
            const gridWidth = rect.width / cols;
            const gridHeight = rect.height / rows;
            const gridValues = initializeGridValues(rows, cols, gridWidth, gridHeight);

            const handleMouseUp = (event) => {
                const { gridX, gridY } = getGridCoordinates(event, rect, gridWidth, gridHeight);

                if (isValidClick(gridValues, gridX, gridY, cols)) {
                    updateGridAndRender(event, context, gridValues, gridX, gridY, gridWidth, gridHeight, rect, scale);
                }
            };

            const handleMouseMove = (event) => {
                const { gridX, gridY } = getGridCoordinates(event, rect, gridWidth, gridHeight);

                if (isValidMouseMove(gridValues, gridX, gridY, cols)) {
                    handleForkPosition(event, rect, scale);
                } else {
                    setForkPosition({ x: 0, y: -100, angle: 0 });
                }
            };

            canvas.addEventListener('mouseup', handleMouseUp);
            canvas.addEventListener('mousemove', handleMouseMove);

            return () => {
                canvas.removeEventListener('mouseup', handleMouseUp);
                canvas.removeEventListener('mousemove', handleMouseMove);
            };
        };

        image.onload = handleImageLoad;
        image.src = '/images/front_banner.png';

        const initializeGridValues = (rows, cols, gridWidth, gridHeight) => {
            // 그리드Values 배열 초기화
            const gridValues: boolean[][] = [];
            for (let i = 0; i < rows; i++) {
                const row: boolean[] = [];
                for (let j = 0; j < cols; j++) {
                    const x = j * gridWidth;
                    const y = i * gridHeight;
                    const imageData = context && context.getImageData(x, y, gridWidth, gridHeight);
                    if (imageData) {
                        let isEmpty = true;
                        for (let k = 0; k < imageData.data.length; k += 4) {
                            if (imageData.data[k + 3] !== 0) {
                                isEmpty = false;
                                break;
                            }
                        }
                        row.push(isEmpty);
                    }
                }
                gridValues.push(row);
            }
            return gridValues;
        };
    
        const getGridCoordinates = (event, rect, gridWidth, gridHeight) => {
            // 마우스 이벤트에서 그리드 좌표 계산
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const gridX = Math.floor(x / gridWidth);
            const gridY = Math.floor(y / gridHeight);
            return { gridX, gridY };
        };
    
        const isValidClick = (gridValues, gridX, gridY, cols) => {
            // 클릭이 유효한지 여부 확인
            const currentCell = gridValues[gridY] && gridValues[gridY][gridX];
            const leftCell = gridValues[gridY] && gridValues[gridY][gridX - 1];
            const rightCell = gridValues[gridY] && gridValues[gridY][gridX + 1];
            const upCell = gridValues[gridY - 1] && gridValues[gridY - 1][gridX];
            const downCell = gridValues[gridY + 1] && gridValues[gridY + 1][gridX];
    
            
            return (
                currentCell === false &&
                (leftCell || rightCell || upCell || downCell || !gridValues[gridY] || gridX === 0 || gridX === cols - 1)
            );
        };
    
        const updateGridAndRender = (event, context, gridValues, gridX, gridY, gridWidth, gridHeight, rect, scale) => {
            // 캔버스 영역 지우기
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            console.log('지워지는지?')
            context.save();
            context.beginPath();
            context.arc(x, y, 30, 0, Math.PI * 2);
            context.clip();
            context.clearRect(0, 0, rect.width * scale, rect.height * scale);
            context.restore();
            
            // 그리드 값 업데이트
            const imageData = context.getImageData(gridX * gridWidth, gridY * gridHeight, gridWidth, gridHeight);
    
            let isEmpty = true;
            for (let k = 0; k < imageData.data.length; k += 4) {
                if (imageData.data[k + 3] !== 0) {
                    isEmpty = false;
                    break;
                }
            }
    
            gridValues[gridY][gridX] = isEmpty;
        };
    
        const isValidMouseMove = (gridValues, gridX, gridY, cols) => {
            // 마우스 이동이 유효한지 여부 확인
            const currentCell = gridValues[gridY] && gridValues[gridY][gridX];
            const leftCell = gridValues[gridY] && gridValues[gridY][gridX - 1];
            const rightCell = gridValues[gridY] && gridValues[gridY][gridX + 1];
            const upCell = gridValues[gridY - 1] && gridValues[gridY - 1][gridX];
            const downCell = gridValues[gridY + 1] && gridValues[gridY + 1][gridX];
    
            return (
                currentCell === false &&
                (leftCell || rightCell || upCell || downCell || !gridValues[gridY] || gridX === 0 || gridX === cols - 1)
            );
        };
    
        const handleForkPosition = (event, rect, scale) => {
            // 포크 위치 처리 로직
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width * scale / 2;
            const centerY = rect.height * scale / 2;
            const angle = Math.atan2(y - centerY, x - centerX);
    
            setForkPosition({ x, y, angle });
        };
    
    }, []);


    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <canvas ref={sandwichRef} className='mx-auto w-80 h-80'></canvas>
            {forkPosition && (
                <img
                    src='/images/fork.png'
                    alt='fork'
                    style={{
                        position: 'absolute',
                        top: forkPosition.y,
                        left: forkPosition.x + 100,
                        pointerEvents: 'none',
                        transform: `rotate(${forkPosition.angle + 180}rad)`,
                        transformOrigin: 'top center', // 회전 중심점을 이미지 중앙으로 설정
                        transition: 'top 1s, left 1s, transform 1s',
                        scale: '0.4'
                    }}
                />
            )}
        </div>
    );
};

export default SandwichBanner;