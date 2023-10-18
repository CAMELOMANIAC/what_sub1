import Logo from '../components/Logo'
import FrontPopularRecipe from '../components/FrontPopularRecipe'
import SearchBar from '../components/SearchBar'
import SandwichBanner from '../components/SandwichBanner'

const Abc = ({users}) => {
  const test: { name: string, value: string }[] = [
    { name: '0', value: '1' },
    { name: '2', value: '1' },
    { name: '4', value: '1' },
    { name: '5', value: '1' },
    { name: '1', value: '4' },
    { name: '3', value: '3' },
  ];

  return (
    <main className=' w-full max-w-screen-xl mx-auto'>
      <SandwichBanner />
      <div className='flex justify-center mx-auto mb-4'>
        <Logo />
      </div>
      {users.length >0 &&(users.map((post) => (
        <div key={post.user_id}>
        <h3>{post.user_id}</h3>
          <h3>{post.user_pwd}</h3>
        </div>
      )))}
      <SearchBar className='pb-4' />
      <FrontPopularRecipe array={test} />
    </main>
  )
}
export async function getServerSideProps() {
  // 서버에서 데이터를 불러올 수 있는 비동기 함수를 사용합니다.
  const res = await fetch(process.env.URL + '/api/users');
  const users = await res.json();

  return {
    props: {
      users,
    },
  };
}

export default Abc
