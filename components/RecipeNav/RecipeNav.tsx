import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import ProgressBar from './ProgressBar';
import { progressBarButtonsType } from '../../pages/AddRecipe';

const NavBackground = styled.div`
    position: fixed;
    bottom:0;
    width:1024px;
    height:80px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px lightgray;
    border-radius: 10px 10px 0px 0px;
`
type NavSandwichProps = {
    $activesection: number;
}
const NavSandwich = styled.div<NavSandwichProps>`
    position: absolute;
    transform: translate(${(props) => props.$activesection * 140 + 40}px, -5px);
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 500ms;
   `
type propsType = {
    progressBarButtons:progressBarButtonsType[],
    isComplete:boolean,
    createContext:()=>void
}

const RecipeNav = ({ progressBarButtons, isComplete, createContext }: propsType) => {

    //observerApi로 관찰
    const [activeSection, setActiveSection] = useState<number>(0);
    let observer: IntersectionObserver;
    useEffect(() => {
        observer = new IntersectionObserver((entries) => {
            //가장위에 있는 요소 탐지
            //(IntersectionObserver는 요소를 여러개 감지하면 가장 마지막 요소만 entry.target에 저장하므로 가장위에것을 탐지하게하기 위해서)
            const firstEntry = entries.reduce((first, entry) => {
                return (entry.boundingClientRect.top < first.boundingClientRect.top) ? entry : first;
            });
            //console.log(firstEntry.target.id);

            if (firstEntry.isIntersecting) {
                switch (firstEntry.target.id) {
                    case 'recipeName': setActiveSection(0); break;
                    case 'bread': setActiveSection(1); break;
                    case 'cheese': setActiveSection(2); break;
                    case 'toasting': setActiveSection(3); break;
                    case 'vegetable': setActiveSection(4); break;
                    case 'sauce': setActiveSection(5); break;
                    default: break;
                }
            }
        }, {
            threshold: [0.5, 1, 1]
        });

        // 관찰할 요소
        progressBarButtons.forEach(element => {
            element.ref.current && observer.observe(element.ref.current);
        });
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <NavBackground className='p-6 grid grid-cols-7 grid-rows-1 font-[seoul-metro]'>
            <NavSandwich $activesection={activeSection}>
                <img src='/images/front_banner.png' className={`w-10`} />
            </NavSandwich>
            {progressBarButtons.map((button) => (
                <ProgressBar
                    key={button.id}
                    activeSection={activeSection}
                    handleClick={button.handleClick}
                    buttonId={button.id}
                    buttonText={button.text}
                />
            ))}
            <button className='col-span-1 flex justify-center align-middle border-t-[8px] border-green-600 mb-[30%]' disabled={!isComplete} onClick={createContext}>
                <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-green-600'></div>
                <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-yellow-400'></div>
                <div className={`col-span-1 text-center absolute mt-1 ` + (!isComplete && 'text-gray-300')}>작성완료</div>
            </button>
        </NavBackground>
    );
};

export default RecipeNav;