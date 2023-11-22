import Logo from '../components/Logo'
import FrontPopularRecipe from '../components/FrontPopularRecipe'
import SandwichBanner from '../components/SandwichBanner'
import { FaSearch } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

const IndexPage = () => {
  const test: { name: string, value: string }[] = [
    { name: '0', value: '1' },
    { name: '2', value: '1' },
    { name: '4', value: '1' },
    { name: '5', value: '1' },
    { name: '1', value: '4' },
    { name: '3', value: '3' },
  ];

  const [searchQuery,setSearchQuery] = useState<string>('');
  const [isFocus, setFocus] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocus){
      inputRef.current && inputRef.current.focus();
    }
  }, [isFocus]);

  useEffect(()=>{
    const focusOutHandler = (e) => {
      if (e.target !== inputRef.current && searchQuery === '') {
        setFocus(false);
        console.log('포커스해제')
      }
    }
    
    addEventListener("mousedown",focusOutHandler)
    return()=>{
      removeEventListener("mousedown",focusOutHandler)
    }
  },[searchQuery])

  const router = useRouter();
  const searchEnterHandler = (e) => {
    if (e.key === 'Enter'){
      queryPushHandler();
    }
  }
  const queryPushHandler = () => {
    router.push(`/Recipes?query=${searchQuery}`)
  }
  
  return (
    <main className=' w-full max-w-screen-xl mx-auto'>
      <div className='flex flex-col items-center justify-center mx-auto mb-4 rounded-full w-[100%]'>
        <SandwichBanner />
        {
          <div className='w-auto bg-white border-[12px] border-green-600 rounded-full px-6 py-2 flex flex-row justify-center items-center'>
            <span className='flex justify-center items-center w-[70px] text-white text-4xl font-extrabold font-[seoul-metro] rounded-full bg-green-600 aspect-square mr-6'>
              <button onClick={queryPushHandler}>
                <FaSearch />
              </button>
            </span>

            <div className='flex flex-col flex-nowrap justify-center items-center mr-6 my-2 text-5xl' onClick={() => setFocus(true)}>
              {isFocus ?
                <input className='p-5 text-lg text-center' type='text' ref={inputRef} onChange={(e)=>setSearchQuery(e.currentTarget.value)} onKeyDown={searchEnterHandler}></input> :
                <Logo />
              }
              <div className='font-[seoul-metro] text-gray-600 text-lg'>넌 뭐먹어?</div>
            </div>
          </div>
        }
      </div>
      <FrontPopularRecipe array={test} />
    </main>
  )
}

export default IndexPage