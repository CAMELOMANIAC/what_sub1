import React, { useState } from 'react';
import IngredientsSection from './sub/IngredientsSection';
import { menuNutrientArray } from '../../utils/menuArray';
import { FaDotCircle } from 'react-icons/fa';
import EmptyRadioBox from './sub/EmptyRadioBox';

export type propsType = {
    prop: {
        state: string,
        onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void,
    },
    param: string,
}
const AddMeatSection = ({ prop, param }: propsType) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    return (
        <IngredientsSection>
                <h3 className='text-xl font-[seoul-metro]'>주메뉴</h3>
            <div className='p-2'>
                <p className='p-2 flex items-center h-12'>{param}</p>
            </div>
            <div className='p-2'>
                {isShow === false && <button className='w-full' onClick={() => setIsShow(true)}>추가하기</button>}
                <ul className={isShow ? 'max-h-[1000px] transition-all duration-500' : 'max-h-0 overflow-hidden transition-all duration-500'}>
                    <EmptyRadioBox name='미트추가' addContext=' 없음' checked={prop.state === ''} onChange={prop.onChange} setIsShow={setIsShow}></EmptyRadioBox>
                    {menuNutrientArray.filter(item => item.name !== '베지').map((item) => (
                        <li key={item.name} className='h-12 flex items-center'>
                            <label className='my-auto flex items-center gruop'>
                                {prop.state === item.name ?
                                    <FaDotCircle className='relative w-6 h-6 mr-2 text-green-600 border rounded-full group-hover:border-gray-500'></FaDotCircle> :
                                    <FaDotCircle className='relative w-6 h-6 mr-2 text-white border rounded-full group-hover:border-1 group-hover:border-gray-500'></FaDotCircle>
                                }
                                <div className='inline-block w-10 overflow-hidden relative rounded-md aspect-square m-auto my-1 mr-2'>
                                    <img src={'/images/sandwich_menu/' + item.name + '.png'} alt={item.name} className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
                                </div>
                                <span className='font-[noto-sans]'>{item.name} 추가</span>
                                <input className='peer invisible absolute' type='checkBox' onChange={prop.onChange} value={item.name}></input>
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