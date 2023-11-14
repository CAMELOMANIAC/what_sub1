import React, { forwardRef, useState } from 'react';
import { cheeseNutrientArray } from '../../utils/menuArray';
import IngredientsSection from './template/IngredientsSection';

export type propsType = {
    prop1: {
        state: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    },
    prop2: {
        state: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    },
}
const CheeseSection = forwardRef<HTMLDivElement, propsType>(({ prop1, prop2 }, ref) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    const showHander = (e: React.ChangeEvent<HTMLInputElement>) => {
        prop2.onChange(e);
        setIsShow(false);
    }

    return (
        <IngredientsSection ref={ref} id='cheese'>
            <h3 className='text-xl font-[seoul-metro]'>치즈 선택</h3>
            <ul className='p-2'>
                {cheeseNutrientArray.map((item) => (
                    /*<li key={item.name} className='flex flex-row items-center'>
                        <RadioBox item={item} section={'cheese'} addContext={'치즈'} getState={cheese} setState={setCheese}></RadioBox>
                    </li>*/
                    <li key={item.name} className='h-12 flex items-center'>
                        <label>
                            <input type='radio' onChange={prop1.onChange} checked={prop1.state === item.name} value={item.name}></input>{item.name}
                        </label>
                    </li>
                ))}
                {/*<li className='h-12 flex items-center'>
            <EmptyRadioBox section={'cheese'} addContext={'치즈'} getState={cheese} setState={setCheese}></EmptyRadioBox>
        </li>*/
                    <li className='h-12 flex items-center'>
                        <label>
                            <input type='radio' onChange={prop1.onChange} checked={prop1.state === ''} value={undefined}></input>치즈 없음
                        </label>
                    </li>
                }
            </ul>

            <h3 className='text-xl font-[seoul-metro]'>치즈 추가</h3>
            <div className='p-2'>
                {isShow === false && <button className='w-full' onClick={() => setIsShow(true)}>추가하기</button>}
                <ul className={isShow ? 'max-h-[1000px] transition-all duration-500' : 'max-h-0 overflow-hidden transition-all duration-500'}>
                    {/*<li className='h-12 flex items-center'>/*
                <EmptyRadioBox section='AddCheese' addContext={'치즈 추가'} getState={AddCheese} onChange={showAddCheeseClickHandler}></EmptyRadioBox>
    </li>*/}
                    <li className='h-12 flex items-center'>
                        <label>
                            <input type='radio' onChange={showHander} checked={prop2.state === ''} value={undefined}></input>치즈 추가 없음
                        </label>
                    </li>
                    {cheeseNutrientArray.map((item) => (/*
                <li key={item.name} className='flex flex-row items-center'>
                    <RadioBox item={item} section='AddCheese' addContex t={'치즈 추가'} getState={AddCheese} setState={setAddCheese}></RadioBox>
                </li>*/
                        <li key={item.name} className='h-12 flex items-center'>
                            <label>
                                <input type='radio' onChange={prop2.onChange} checked={prop2.state === item.name} value={item.name}></input>{item.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </IngredientsSection>
    );
});


CheeseSection.displayName = 'CheeseSection';
export default CheeseSection;