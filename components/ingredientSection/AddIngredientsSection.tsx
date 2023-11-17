import React, { useState } from 'react';
import { ingredientsArray } from '../../utils/menuArray';
import IngredientsSection from './sub/IngredientsSection';
import CheckBox from './sub/CheckBox';
import EmptyCheckBox from './sub/EmptyCheckBox';

export type propsType = {
    prop: {
        array: string[],
        setArray: React.Dispatch<React.SetStateAction<string[]>>,
        onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void,
    },
}
const AddIngredientsSection = ({ prop }: propsType) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    return (
        <IngredientsSection>
            <h3 className='text-xl font-[seoul-metro]'>추가재료</h3>
            {isShow === false && <button className='w-full' onClick={() => setIsShow(true)}>추가하기</button>}
            <div className={isShow ? 'max-h-[1000px] transition-all duration-500' : 'max-h-0 overflow-hidden transition-all duration-500'}>
                <ul className='mb-4 p-4'>
                    <EmptyCheckBox prop={prop} text='추가재료 없음' setIsShow={setIsShow}></EmptyCheckBox>
                    {ingredientsArray.map((item) => (
                        <CheckBox key={item.name} name={item.name} addContext='' checked={prop.array.includes(item.name)} onChange={prop.onChange}></CheckBox>
                    ))}
                </ul>
            </div>
        </IngredientsSection>
    );
};

export default AddIngredientsSection;