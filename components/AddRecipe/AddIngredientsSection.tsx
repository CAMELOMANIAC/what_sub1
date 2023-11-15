import React, { useState } from 'react';
import { ingredientsArray } from '../../utils/menuArray';
import IngredientsSection from './template/IngredientsSection';

export type propsType = {
    prop: {
        array: string[],
        onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void,
    },
}
const AddIngredientsSection = ({ prop }: propsType) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    const showHander = (e : React.ChangeEvent<HTMLInputElement>) => {
        prop.onChange(e);
        setIsShow(false);
    }
    return (
        <IngredientsSection>
            <h3 className='text-xl font-[seoul-metro]'>추가재료</h3>
            {isShow === false && <button className='w-full' onClick={() => setIsShow(true)}>추가하기</button>}
            <div className={isShow ? 'max-h-[1000px] transition-all duration-500' : 'max-h-0 overflow-hidden transition-all duration-500'}>
                <ul className='mb-4 p-4'>
                    <li className='h-12 flex flex-row items-center'>
                        <label>
                            <input type='checkbox' onChange={showHander} checked={prop.array.length === 0} value={''}></input>추가재료 없음
                        </label>
                    </li>
                    {ingredientsArray.map((item) => (
                        <li key={item.name} className='h-12 flex items-center'>
                            <label>
                                <input type='checkbox' onChange={prop.onChange} checked={prop.array.includes(item.name)} value={item.name}></input>{item.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </IngredientsSection>
    );
};

export default AddIngredientsSection;

/*

    <IngredientsSection>
        <h3 className='text-xl font-[seoul-metro]'>추가재료</h3>
        {isShow === false && <button className='w-full' onClick={() => setIsShowAddIngredient(true)}>추가하기</button>}
        <div className={isShow ? 'max-h-[1000px] transition-all duration-500' : 'max-h-0 overflow-hidden transition-all duration-500'}>
            <ul className='mb-4 p-4'>
                <div className='flex flex-row h-12 items-center'>
                    <EmptyCheckBox section={'addIngredient'} addContext={'재료 추가'} onChange={() => showAddIngredientClickHandler()}></EmptyCheckBox>
                </div>
                {ingredientsArray.map((item) => (
                    <li key={item.name} className='flex flex-row items-center'>
                        <CheckBox item={item} section={'addIngredient'} addContext={'추가'} getState={addIngredient} onChange={addIngredientChagedHandler}></CheckBox>
                    </li>
                ))}
            </ul>
        </div>
    </IngredientsSection> */