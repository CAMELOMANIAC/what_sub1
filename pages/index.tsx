import Link from 'next/link'
import Layout from '../components/Layout'
import styled from 'styled-components'
import FrontPopularRecipe from '../components/FrontPopularRecipe'
import SearchBar from '../components/SearchBar'

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
      <FrontBanner src="/images/front_banner.jpeg" alt="subway" className='mx-auto'/>
      <div className='flex justify-center mx-auto mb-4'>
        <LogoSpan color='#ffce32'>WhaT</LogoSpan><LogoSpan color='#009223'>SuB</LogoSpan>
      </div>
      <SearchBar className='pb-4'/>
      <FrontPopularRecipe array={test} />
  </main>
)

export default IndexPage
