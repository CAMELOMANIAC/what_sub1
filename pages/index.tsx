import Logo from '../components/Logo'
import FrontPopularRecipe from '../components/FrontPopularRecipe'
import SearchBar from '../components/SearchBar'

const IndexPage = () => {
  const test : { name: string, value: string }[]  = [
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
      <div className='flex justify-center mx-auto mb-4'>
        <Logo />
      </div>
      <SearchBar className='pb-4' />
      <FrontPopularRecipe array={test} />
    </main>
  )
}

export default IndexPage
