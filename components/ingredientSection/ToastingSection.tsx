import React, { Dispatch, SetStateAction, forwardRef } from 'react';
import IngredientsSection from './sub/IngredientsSection';

export type propsType = {
    prop: {
        state: boolean,
        setState: Dispatch<SetStateAction<boolean>>,
    },
}
const ToastingSection = forwardRef<HTMLDivElement, propsType>(({ prop }, ref) => {
    return (
        <IngredientsSection ref={ref} id='toasting'>
            <h3 className='text-xl font-[seoul-metro] pb-4'>토스팅 여부</h3>
            <div className='w-full h-12 border border-gray-200'>
                <button onClick={() => prop.setState(true)} className={`w-1/2 h-full rounded-l ${prop.state && 'bg-green-600 text-white'}`}>예</button>
                <button onClick={() => prop.setState(false)} className={`w-1/2 h-full rounded-r ${prop.state === false && 'bg-green-600 text-white'}`}>아니오</button>
            </div>
        </IngredientsSection>
    );
});

ToastingSection.displayName = 'ToastingSection';
export default ToastingSection;