
import { recipeContextType } from '../interfaces/AddRecipe';
import Carousel from '../components/Carousel';
import IndexLogo from '../components/IndexLogo';


export async function getServerSideProps() {
  //보여줄 레시피 가져오기
  const loadTotalMenuInfo = async () => {
    const result = await fetch(`${process.env.URL}/api/recipe?query=&offset=0&limit=12&filter메뉴이름&filter=레시피제목&filter=작성자&filter=재료&filter=태그`);
    return result.json();
  }
  return {
    props: { recipeData: await loadTotalMenuInfo() },
  };
}


const IndexPage = ({ recipeData }: { recipeData: recipeContextType[] }) => {

  return (
    <main className=' w-full max-w-screen-xl mx-auto'>
      <IndexLogo/>
      <Carousel recipeData={recipeData}></Carousel>
    </main>
  )
}

export default IndexPage