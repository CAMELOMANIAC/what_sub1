import React, { forwardRef } from 'react';
import IngredientsSection from './sub/IngredientsSection';
import { breadNutrientArray } from '../../utils/menuArray';
import InputBox from './sub/InputBox';

export type propsType = {
    prop: {
        state: string,
        onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void,
    },
}
const BreadSection = forwardRef<HTMLDivElement, propsType>(({ prop }, ref) => {
    console.log(prop.state)
    const testHandler =(e)=>{
        prop.onChange
        console.log(e)
        console.log(prop.state)
    }

    return (
        <IngredientsSection ref={ref} id='bread'>
            <h3 className='text-xl font-[seoul-metro]'>빵 선택</h3>
            <ul className='p-2'>
                {breadNutrientArray.map((item) => (
                    <InputBox key={item.name} inputType='radio' name={item.name} addContext='' checked={prop.state === item.name} value={item.name} onChange={prop.onChange}></InputBox>
                ))}
            </ul>
        </IngredientsSection>
    );
});

BreadSection.displayName = 'BreadSection';
export default BreadSection;