import React, { useState } from 'react';
import IngredientsSection from './template/IngredientsSection';
import { menuNutrientArray } from '../../utils/menuArray';

export type propsType = {
    prop: {
        state: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    },
    param: string,
}
const AddMeatSection = ({ prop, param }: propsType) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    const showHander = (e: React.ChangeEvent<HTMLInputElement>) => {
        prop.onChange(e);
        setIsShow(false);
    }
    return (
        <IngredientsSection>
            <div className='p-2'>
                <h3 className='text-xl font-[seoul-metro]'>주메뉴</h3>
                <p className='p-2 flex items-center h-12'>{param}</p>
            </div>
            <div className='p-2'>
                {isShow === false && <button className='w-full' onClick={() => setIsShow(true)}>추가하기</button>}
                <ul className={isShow ? 'max-h-[1000px] transition-all duration-500' : 'max-h-0 overflow-hidden transition-all duration-500'}>
                    <li className='h-12 flex flex-row items-center'>
                        <label>
                            <input type='radio' onChange={showHander} checked={prop.state === ''} value={''}></input>미트추가 없음
                        </label>
                    </li>
                    {menuNutrientArray.filter(item => item.name !== '베지').map((item) => (
                        <li key={item.name} className='h-12 flex flex-row items-center'>
                            <label>
                                <input type='radio' onChange={prop.onChange} checked={prop.state === item.name} value={item.name}></input>{item.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </IngredientsSection>
    );
};

export default AddMeatSection;


/*<IngredientsSection>
                            <div className='p-2'>
                                <h3 className='text-xl font-[seoul-metro]'>주메뉴</h3>
                                <p className='p-2 flex items-center h-12'>{param}</p>
                            </div>
                            <div className='p-2'>
                                {isShowAddMeat === false && <button className='w-full' onClick={() => setIsShowAddMeat(true)}>추가하기</button>}
                                <ul className={isShowAddMeat ? 'max-h-[1000px] transition-all duration-500' : 'max-h-0 overflow-hidden transition-all duration-500'}>
                                    <li className='flex flex-row items-center h-12'>
                                        <EmptyRadioBox section={'addMeat'} addContext={'미트 추가'} getState={addMeat} onChange={showAddMeatClickHandler}></EmptyRadioBox>
                                    </li>
                                    {menuNutrientArray.filter(item => item.name !== '베지').map((item) => (
                                        <li key={item.name} className='flex flex-row items-center'>
                                            <RadioBox item={item} section={'addMeat'} addContext={'추가'} getState={addMeat} setState={setAddMeat}></RadioBox>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </IngredientsSection> */