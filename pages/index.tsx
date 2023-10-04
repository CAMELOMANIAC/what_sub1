import Link from 'next/link'
import Layout from '../components/Layout'
import styled from 'styled-components'
import FrontPopularRecipe from '../components/FrontPopularRecipe'
import { IoSearchCircleSharp } from 'react-icons/io5';

const LogoSpan = styled.span<{ color: string }>`
  @font-face {
    font-family: 'LogoFont';
    src: url('/font/Subway.ttf') format('truetype');
  }
  font-family: 'LogoFont';
  font-size: 50px;
  color:${props => props.color};
`
const FrontBanner = styled.img`
  width: 300px;`

const test = [
  { name: '0', value: '1' },
  { name: '2', value: '1' },
  { name: '4', value: '1' },
  { name: '5', value: '1' },
  { name: '1', value: '4' },
  { name: '3', value: '3' },
];

const IndexPage = () => (
  <main className=' w-full max-w-screen-xl mx-auto'>
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
      <p>
        <Link href="/about">About</Link>
      </p>

      <FrontBanner src="/images/front_banner.jpeg" alt="subway" className='mx-auto'/>
      <div className='flex justify-center mx-auto mb-4'>
        <LogoSpan color='#ffce32'>WhaT</LogoSpan><LogoSpan color='#009223'>SuB</LogoSpan>
      </div>

      <div className="group relative flex flex-wrap items-stretch focus-within:text-yellow-500 text-lime-600 w-96 mx-auto">
        <input type="search" name="serch" placeholder="다른 사람은 무엇을 먹을까요?" className="bg-white w-full placeholder:italic border border-lime-600 rounded-full text-sm py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-yellow-500 focus:ring-yellow-500 focus:ring-1 text-black input-no-clear" />
        <button type="submit" className="absolute right-0 mr-1 mt-1">
          <IoSearchCircleSharp className='text-3xl '/>
        </button>
      </div>
      <FrontPopularRecipe array={test} />
    </Layout>
  </main>
)

export default IndexPage
