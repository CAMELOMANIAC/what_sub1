import React from 'react';

const ProgressBar = ({ activeSection, handleClick, buttonId, buttonText }: { activeSection: number, handleClick: (_e) => void, buttonId: string, buttonText: string }) => {
  return (
    <button
      className='col-span-1 flex justify-center align-middle border-t-[8px] border-green-600'
      onClick={(e) => handleClick(e)}
      id={buttonId}
    >
      {activeSection === parseInt(buttonId) ? (
        <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-green-600'></div>
      ) : (
        <div className='bg-white w-[8px] h-[8px] translate-y-[-8px] rounded-full border-[1px] border-green-600'></div>
      )}
      <div className='col-span-1 text-center absolute mt-1'>{buttonText}</div>
    </button>
  );
};

export default ProgressBar;