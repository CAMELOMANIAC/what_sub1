import React from 'react';

const Menus = () => {
    const menuArray: { name: string, value: string }[] = [
        { name: '0', value: '1' },
        { name: '2', value: '1' },
        { name: '4', value: '1' },
        { name: '5', value: '1' },
        { name: '1', value: '4' },
        { name: '3', value: '3' },
    ];

    return (
        <main className=' w-full max-w-screen-xl mx-auto'>
            <img src="/images/front_banner.png" alt="subway" className='mx-auto w-80' />

            <div className="grid grid-cols-6 gap-4 w-[66rem]">
                <div className="col-span-2 border">
                    
                </div>
                
                <div className="col-span-4 border">
                    {menuArray?.map((item, index) => (
                        <div className={`relative w-96 h-12 flex justify-center items-center ${index >= 4 ? 'border-l' : ''}`} key={index}>
                            <p className="absolute left-4">{index}</p>{item.name} + {item.value}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Menus;