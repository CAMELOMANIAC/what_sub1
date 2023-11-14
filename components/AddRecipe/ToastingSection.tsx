import React, { Dispatch, SetStateAction, forwardRef } from 'react';
import IngredientsSection from './template/IngredientsSection';

export type propsType = {
    prop: {
        state: boolean,
        setState: Dispatch<SetStateAction<boolean>>,
    },
}
const ToastingSection = forwardRef<HTMLDivElement, propsType>(({ prop }, ref) => {
    return (
        <IngredientsSection ref={ref} id='toasting'>
            <h3 className='text-xl font-[seoul-metro]'>토스팅 여부</h3>
            <button onClick={() => prop.setState(true)} className={`${prop.state && 'bg-green-600 text-white'}`}>예</button>
            <button onClick={() => prop.setState(false)} className={`${prop.state === false && 'bg-green-600 text-white'}`}>아니오</button>
        </IngredientsSection>
    );
});

ToastingSection.displayName = 'ToastingSection';
export default ToastingSection;