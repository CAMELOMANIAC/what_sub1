import Logo from '../components/Logo'
import FrontPopularRecipe from '../components/FrontPopularRecipe'
import SearchBar from '../components/SearchBar'
import SandwichBanner from '../components/SandwichBanner'
import { FaSearch } from 'react-icons/fa';

type Post = {
  user_id: string;
  user_pwd: string;
};

export async function getServerSideProps(): Promise<{ props: { users: Post[] } }> {
  // 서버에서 데이터를 불러올 수 있는 비동기 함수를 사용합니다.
  const res = await fetch(process.env.URL + '/api/users');
  const users: Post[] = await res.json();
  return {
    props: {
      users,
    },
  };
}

const IndexPage = ({ users }: { users: Post[] }) => {
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
      <div className='flex flex-col items-center justify-center mx-auto mb-4 rounded-full w-[100%]'>
        <SandwichBanner />
        {
          <div className='w-auto bg-white border-[12px] border-green-600 rounded-full px-6 py-2 flex flex-row justify-center items-center'>
            <span className='flex justify-center items-center w-[70px] text-white text-4xl font-extrabold font-[seoul-metro] rounded-full bg-green-600 aspect-square mr-6'><FaSearch /></span>
            <div className='flex flex-col flex-nowrap justify-center items-center mr-6 my-2 text-5xl'>
              <Logo />
              <div className='font-[seoul-metro] text-gray-600 text-lg'>넌 뭐먹어?</div>
            </div>
          </div>
        }
        {/*
        <div className='w-auto bg-white border-[30px] border-green-600 rounded-full px-6 py-2 mt-10 flex flex-row justify-center items-center aspect-square'>
          <div className='flex flex-col flex-nowrap justify-center items-center'>
            <Logo />
            <div className='font-[seoul-metro] text-gray-600 text-lg'>넌 뭐먹어?</div>
          </div>
      </div>
      <SearchBar></SearchBar>*/}
      </div>
      {/*users.length >0 &&(users.map((post) => (
        <div key={post.user_id}>
        <h3>{post.user_id}</h3>
          <h3>{post.user_pwd}</h3>
        </div>
      )))
      */}
      <FrontPopularRecipe array={test} />
    </main>
  )
}

export default IndexPage

/* 클라이언트사이드렌더링일때
const IndexPage = () => {
  const test: { name: string, value: string }[] = [
    { name: '0', value: '1' },
    { name: '2', value: '1' },
    { name: '4', value: '1' },
    { name: '5', value: '1' },
    { name: '1', value: '4' },
    { name: '3', value: '3' },
  ];

  type Post = {
    user_id: string;
    user_pwd: string;
  };

  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        return setPosts(data)
      });
  }, []);

  useEffect(() => {
    console.log(posts)
  }, [posts]);


  return (
    <main className=' w-full max-w-screen-xl mx-auto'>
      <SandwichBanner />
      <div className='flex justify-center mx-auto mb-4'>
        <Logo />
      </div>
      {posts.length >0 &&(posts.map((post) => (
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
 */