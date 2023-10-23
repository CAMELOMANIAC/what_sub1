import { useState } from 'react';
import { menuArray } from '../utils/menuArray';
import styled from 'styled-components';

const RecipeNav = styled.div`
    position: fixed;
    bottom:0;
    width:1024px;
    height:80px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px lightgray;
    border-radius: 10px 10px 0px 0px;
`

const AddRecipe = ({ param }) => {
    const index = menuArray.findIndex((item) => (item.name === param));
    const [bread, setBread] = useState<string>('하티');
    const [isTosting, setIsTosting] = useState<boolean>(true);
    const [cheese, setCheese] = useState<string>('아메리칸');
    const [AddCheese, setAddCheese] = useState<string>('');
    const [vegetable, setVegetable] = useState<string[]>(['양상추', '토마토', '오이', '피망', '양파']);
    const [pickle, setPickle] = useState<string[]>(['피클', '올리브', '할라피뇨']);
    const [sauce, setSauce] = useState<string[]>([]);
    const [addIngredient, setAddingredient] = useState<string[]>([]);
    const [addMeat, setAddMeat] = useState<string>('');

    const [isShowAddMeat, setIsShowAddMeat] = useState<boolean>(false);

    const vegetableChagedHandler = (e) => {
        if (e.target.checked) {
            setVegetable([...vegetable, e.target.value]);
        } else {
            setVegetable(vegetable.filter(item => item !== e.target.value));
        }
    }
    const pickleChagedHandler = (e) => {
        if (e.target.checked) {
            setPickle([...pickle, e.target.value]);
        } else {
            setPickle(pickle.filter(item => item !== e.target.value));
        }
    }
    const sauceChagedHandler = (e) => {
        if (e.target.checked && sauce.length < 3) {
            setSauce([...sauce, e.target.value]);
        } else {
            setSauce(sauce.filter(item => item !== e.target.value));
        }
    }

    const addIngredientChagedHandler = (e) => {
        if (e.target.checked) {
            setAddingredient([...addIngredient, e.target.value]);
        } else {
            setAddingredient(addIngredient.filter(item => item !== e.target.value));
        }
    }

    const showAddMeatClickHandler=()=>{
        setIsShowAddMeat(false);
        setAddMeat('')
    }
    return (
        <main className={'w-full max-w-screen-lg mx-auto'}>
            <div className='w-[1024px] grid grid-cols-6'>
                <div className="col-span-3 h-[300px]">
                    <h2 className='text-2xl'>{param}</h2>
                    <div className='whitespace-pre-line'>{menuArray[index].summary}</div>
                    <img src={`/images/sandwich_menu/${param}.png`} alt={String(param)} className='absolute right-[50%] object-contain object-right h-[350px] drop-shadow-lg'></img>
                </div>
                <div className="col-span-3">
                    <div className="bg-white rounded-md shadow-sm mb-2 p-6">
                        <h3>레시피 이름</h3>
                        <input type=''></input>
                    </div>
                    <div className="flex flex-col justify-start bg-white rounded-md shadow-sm mb-2 p-6">
                        <h3>주메뉴</h3>
                        {param}
                    </div>
                    <div className="flex flex-col justify-start bg-white rounded-md shadow-sm mb-2 p-6">
                        <h3>미트추가</h3>
                        {isShowAddMeat===false && <button onClick={()=>setIsShowAddMeat(true)}>추가하기</button>}
                        {isShowAddMeat &&
                            <>
                                <div>
                                    <input type='radio' id='미트 추가 없음' name='addMeat' value='미트 추가 없음' onChange={showAddMeatClickHandler} ></input>
                                    <label htmlFor='미트 추가 없음'>미트 추가 없음</label>
                                </div>
                                <div>
                                    <input type='radio' id='참치 추가' name='addMeat' value='참치 추가' checked={addMeat === ('참치 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='참치 추가'>참치 추가</label>
                                </div>
                                <div>
                                    <input type='radio' id='햄 추가' name='addMeat' value='햄 추가' checked={addMeat === ('햄 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='햄 추가'>햄 추가</label>
                                </div>
                                <div>
                                    <input type='radio' id='B.L.T 추가' name='addMeat' value='B.L.T 추가' checked={addMeat === ('B.L.T 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='B.L.T 추가'>B.L.T 추가</label>
                                </div>
                                <div>
                                    <input type='radio' id='B.M.T 추가' name='addMeat' value='B.M.T 추가' checked={addMeat === ('B.M.T 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='B.M.T 추가'>B.M.T 추가</label>
                                </div>
                                <div>
                                    <input type='radio' id='스파이시 이탈리안 추가' name='addMeat' value='스파이시 이탈리안 추가' checked={addMeat === ('스파이시 이탈리안 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='스파이시 이탈리안 추가'>스파이시 이탈리안 추가</label>
                                </div>
                                <div>
                                    <input type='radio' id='치킨 데리야끼 추가' name='addMeat' value='치킨 데리야끼 추가' checked={addMeat === ('치킨 데리야끼 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='치킨 데리야끼 추가'>치킨 데리야끼 추가</label>
                                </div>
                                <div>
                                    <input type='radio' id='서브웨이클럽 추가' name='addMeat' value='서브웨이클럽 추가' checked={addMeat === ('서브웨이클럽 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='서브웨이클럽 추가'>서브웨이클럽 추가</label>
                                </div>
                                <div>
                                    <input type='radio' id='풀드포크 추가' name='addMeat' value='풀드포크 추가' checked={addMeat === ('풀드포크 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='풀드포크 추가'>풀드포크 추가</label>
                                </div>
                                <div>
                                    <input type='radio' id='k-bbq 추가' name='addMeat' value='k-bbq 추가' checked={addMeat === ('k-bbq 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='k-bbq 추가'>k-bbq 추가</label>
                                </div>
                                <div>
                                    <input type='radio' id='로스트 치킨 추가' name='addMeat' value='로스트 치킨 추가' checked={addMeat === ('로스트 치킨 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='로스트 치킨 추가'>로스트 치킨 추가</label>
                                </div>
                                <div>
                                    <input type='radio' id='로티세리 치킨 추가' name='addMeat' value='로티세리 치킨 추가' checked={addMeat === ('로티세리 치킨 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='로티세리 치킨 추가'>로티세리 치킨 추가</label>
                                </div>
                                <div>
                                    <input type='radio' id='치킨 슬라이스 추가' name='addMeat' value='치킨 슬라이스 추가' checked={addMeat === ('치킨 슬라이스 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='치킨 슬라이스 추가'>치킨 슬라이스 추가</label>
                                </div>
                                <div>
                                    <input type='radio' id='스파이시 바비큐 추가' name='addMeat' value='스파이시 바비큐 추가' checked={addMeat === ('스파이시 바비큐 추가')} onChange={(e) => (setAddMeat(e.target.value))} ></input>
                                    <label htmlFor='스파이시 바비큐 추가'>스파이시 바비큐 추가</label>
                                </div>
                            </>
                        }
                    </div>
                    <div className="flex flex-col justify-start bg-white rounded-md shadow-sm mb-2 p-6">
                        <h3>빵 선택</h3>
                        <div>
                            <input type='radio' id='하티' name='bread' value='하티' checked={bread === '하티'} onChange={(e) => (setBread(e.target.value))}></input>
                            <label htmlFor='하티'>하티</label>
                        </div>
                        <div>
                            <input type='radio' id='허니오트' name='bread' value='허니오트' checked={bread === '허니오트'} onChange={(e) => (setBread(e.target.value))} ></input>
                            <label htmlFor='허니오트'>허니오트</label>
                        </div>
                        <div>
                            <input type='radio' id='플랫브레드' name='bread' value='플랫브레드' checked={bread === '플랫브레드'} onChange={(e) => (setBread(e.target.value))}></input>
                            <label htmlFor='플랫브레드'>플랫브레드</label>
                        </div>
                        <div>
                            <input type='radio' id='위트' name='bread' value='위트' checked={bread === '위트'} onChange={(e) => (setBread(e.target.value))}></input>
                            <label htmlFor='위트'>위트</label>
                        </div>
                        <div>
                            <input type='radio' id='파마산오레가노' name='bread' value='파마산오레가노' checked={bread === '파마산오레가노'} onChange={(e) => (setBread(e.target.value))}></input>
                            <label htmlFor='파마산오레가노'>파마산오레가노</label>
                        </div>
                        <div>
                            <input type='radio' id='화이트' name='bread' value='화이트' checked={bread === '화이트'} onChange={(e) => (setBread(e.target.value))}></input>
                            <label htmlFor='화이트'>화이트</label>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-sm mb-2 p-6">
                        <h3>치즈 선택</h3>
                        <div>
                            <input type='radio' id='아메리칸' name='cheese' value='아메리칸' checked={cheese === '아메리칸'} onChange={(e) => (setCheese(e.target.value))} ></input>
                            <label htmlFor='아메리칸'>아메리칸</label>
                        </div>
                        <div>
                            <input type='radio' id='슈레드' name='cheese' value='슈레드' checked={cheese === '슈레드'} onChange={(e) => (setCheese(e.target.value))} ></input>
                            <label htmlFor='슈레드'>슈레드</label>
                        </div>
                        <div>
                            <input type='radio' id='모짜렐라' name='cheese' value='모짜렐라' checked={cheese === '모짜렐라'} onChange={(e) => (setCheese(e.target.value))} ></input>
                            <label htmlFor='모짜렐라'>모짜렐라</label>
                        </div>
                        <div>
                            <input type='radio' id='치즈 없음' name='cheese' value='치즈 없음' checked={cheese === ''} onChange={(e) => (setCheese(''))} ></input>
                            <label htmlFor='치즈 없음'>치즈없음</label>
                        </div>
                        <h3>치즈 추가</h3>
                        <div>
                            <input type='radio' id='치즈 추가 없음' name='AddCheese' value='치즈 추가 없음' checked={AddCheese === ''} onChange={(e) => (setAddCheese(''))} ></input>
                            <label htmlFor='치즈 추가 없음'>치즈 추가 없음</label>
                        </div>
                        <div>
                            <input type='radio' id='아메리칸 추가' name='AddCheese' value='아메리칸 추가' checked={AddCheese === '아메리칸 추가'} onChange={(e) => (setAddCheese(e.target.value))} ></input>
                            <label htmlFor='아메리칸 추가'>아메리칸 치즈 추가</label>
                        </div>
                        <div>
                            <input type='radio' id='슈레드 추가' name='AddCheese' value='슈레드 추가' checked={AddCheese === '슈레드 추가'} onChange={(e) => (setAddCheese(e.target.value))} ></input>
                            <label htmlFor='슈레드 추가'>슈레드 치즈 추가</label>
                        </div>
                        <div>
                            <input type='radio' id='모짜렐라 추가' name='AddCheese' value='모짜렐라 추가' checked={AddCheese === '모짜렐라 추가'} onChange={(e) => (setAddCheese(e.target.value))} ></input>
                            <label htmlFor='모짜렐라 추가'>모짜렐라 치즈 추가</label>
                        </div>
                    </div>

                    <div className="bg-white rounded-md shadow-sm mb-2 p-6">
                        <h3>추가재료</h3>
                        <div>
                            <input type='checkbox' id='추가재료 없음' name='addIngredient' value='추가재료 없음' checked={addIngredient.length === 0} onChange={() => setAddingredient([])} ></input>
                            <label htmlFor='추가재료 없음'>추가재료 없음</label>
                        </div>
                        <div>
                            <input type='checkbox' id='에그마요' name='addIngredient' value='에그마요' checked={addIngredient.includes('에그마요')} onChange={addIngredientChagedHandler} ></input>
                            <label htmlFor='에그마요'>에그마요</label>
                        </div>
                        <div>
                            <input type='checkbox' id='페퍼로니' name='addIngredient' value='페퍼로니' checked={addIngredient.includes('페퍼로니')} onChange={addIngredientChagedHandler} ></input>
                            <label htmlFor='페퍼로니'>페퍼로니</label>
                        </div>
                        <div>
                            <input type='checkbox' id='베이컨' name='addIngredient' value='베이컨' checked={addIngredient.includes('베이컨')} onChange={addIngredientChagedHandler} ></input>
                            <label htmlFor='베이컨'>베이컨</label>
                        </div>
                        <div>
                            <input type='checkbox' id='아보카도' name='addIngredient' value='아보카도' checked={addIngredient.includes('아보카도')} onChange={addIngredientChagedHandler} ></input>
                            <label htmlFor='아보카도'>아보카도</label>
                        </div>
                        <div>
                            <input type='checkbox' id='오믈렛' name='addIngredient' value='오믈렛' checked={addIngredient.includes('오믈렛')} onChange={addIngredientChagedHandler} ></input>
                            <label htmlFor='오믈렛'>오믈렛</label>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-sm mb-2 p-6">
                        <h3>토스팅 여부</h3>
                        <div>
                            <button onClick={() => setIsTosting(true)} className={`${isTosting && 'bg-green-600 text-white'}`}>예</button>
                            <button onClick={() => setIsTosting(false)} className={`${isTosting === false && 'bg-green-600 text-white'}`}>아니오</button>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-sm mb-2 p-6">
                        <h3>신선 채소 선택</h3>
                        <div>
                            <input type='checkbox' id='양상추' name='vegetable' value='양상추' checked={vegetable.includes('양상추')} onChange={vegetableChagedHandler} ></input>
                            <label htmlFor='양상추'>양상추</label>
                        </div>
                        <div>
                            <input type='checkbox' id='토마토' name='vegetable' value='토마토' checked={vegetable.includes('토마토')} onChange={vegetableChagedHandler} ></input>
                            <label htmlFor='토마토'>토마토</label>
                        </div>
                        <div>
                            <input type='checkbox' id='오이' name='vegetable' value='오이' checked={vegetable.includes('오이')} onChange={vegetableChagedHandler} ></input>
                            <label htmlFor='오이'>오이</label>
                        </div>
                        <div>
                            <input type='checkbox' id='피망' name='vegetable' value='피망' checked={vegetable.includes('피망')} onChange={vegetableChagedHandler} ></input>
                            <label htmlFor='피망'>피망</label>
                        </div>
                        <div>
                            <input type='checkbox' id='양파' name='vegetable' value='양파' checked={vegetable.includes('양파')} onChange={vegetableChagedHandler} ></input>
                            <label htmlFor='양파'>양파</label>
                        </div>
                        <div>
                            <input type='checkbox' id='신선 채소 없음' name='vegetable' value='신선 채소 없음' checked={vegetable.length === 0} onChange={() => setVegetable([])} ></input>
                            <label htmlFor='신선 채소 없음'>신선 채소 없음</label>
                        </div>
                        <h3>절임 채소 선택</h3>
                        <div>
                            <input type='checkbox' id='피클' name='pickle' value='피클' checked={pickle.includes('피클')} onChange={pickleChagedHandler} ></input>
                            <label htmlFor='피클'>피클</label>
                        </div>
                        <div>
                            <input type='checkbox' id='올리브' name='pickle' value='올리브' checked={pickle.includes('올리브')} onChange={pickleChagedHandler} ></input>
                            <label htmlFor='올리브'>올리브</label>
                        </div>
                        <div>
                            <input type='checkbox' id='할라피뇨' name='pickle' value='할라피뇨' checked={pickle.includes('할라피뇨')} onChange={pickleChagedHandler} ></input>
                            <label htmlFor='할라피뇨'>할라피뇨</label>
                        </div>
                        <div>
                            <input type='checkbox' id='절임 채소 없음' name='pickle' value='절임 채소 없음' checked={pickle.length === 0} onChange={() => setPickle([])} ></input>
                            <label htmlFor='절임 채소 없음'>절임 채소 없음</label>
                        </div>
                    </div>

                    <div className="bg-white rounded-md shadow-sm mb-2 p-6">
                        <h3>소스</h3>
                        <span>(최대3개)</span>
                        <div>
                            <input type='checkbox' id='랜치' name='sauce' value='랜치' checked={sauce.includes('랜치')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='랜치'>랜치</label>
                        </div>
                        <div>
                            <input type='checkbox' id='스위트 어니언' name='sauce' value='스위트 어니언' checked={sauce.includes('스위트 어니언')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='스위트 어니언'>스위트 어니언</label>
                        </div>
                        <div>
                            <input type='checkbox' id='마요네즈' name='sauce' value='마요네즈' checked={sauce.includes('마요네즈')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='마요네즈'>마요네즈</label>
                        </div>
                        <div>
                            <input type='checkbox' id='스위트 칠리' name='sauce' value='스위트 칠리' checked={sauce.includes('스위트 칠리')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='스위트 칠리'>스위트 칠리</label>
                        </div>
                        <div>
                            <input type='checkbox' id='스모크 바베큐' name='sauce' value='스모크 바베큐' checked={sauce.includes('스모크 바베큐')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='스모크 바베큐'>스모크 바베큐</label>
                        </div>
                        <div>
                            <input type='checkbox' id='핫 칠리' name='sauce' value='핫 칠리' checked={sauce.includes('핫 칠리')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='핫 칠리'>핫 칠리</label>
                        </div>
                        <div>
                            <input type='checkbox' id='허니 머스타드' name='sauce' value='허니 머스타드' checked={sauce.includes('허니 머스타드')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='허니 머스타드'>허니 머스타드</label>
                        </div>
                        <div>
                            <input type='checkbox' id='사우스 웨스트 치폴레' name='sauce' value='사우스 웨스트 치폴레' checked={sauce.includes('사우스 웨스트 치폴레')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='사우스 웨스트 치폴레'>사우스 웨스트 치폴레</label>
                        </div>
                        <div>
                            <input type='checkbox' id='홀스래디쉬' name='sauce' value='홀스래디쉬' checked={sauce.includes('홀스래디쉬')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='홀스래디쉬'>홀스래디쉬</label>
                        </div>
                        <div>
                            <input type='checkbox' id='머스타드' name='sauce' value='머스타드' checked={sauce.includes('머스타드')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='머스타드'>머스타드</label>
                        </div>
                        <div>
                            <input type='checkbox' id='올리브오일' name='sauce' value='올리브오일' checked={sauce.includes('올리브오일')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='올리브오일'>올리브오일</label>
                        </div>
                        <div>
                            <input type='checkbox' id='레드와인식초' name='sauce' value='레드와인식초' checked={sauce.includes('레드와인식초')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='레드와인식초'>레드와인식초</label>
                        </div>
                        <div>
                            <input type='checkbox' id='소금' name='sauce' value='소금' checked={sauce.includes('소금')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='소금'>소금</label>
                        </div>
                        <div>
                            <input type='checkbox' id='후추' name='sauce' value='후추' checked={sauce.includes('후추')} onChange={sauceChagedHandler} ></input>
                            <label htmlFor='후추'>후추</label>
                        </div>
                        <div>
                            <input type='checkbox' id='소스 없음' name='sauce' value='소스 없음' checked={sauce.length === 0} onChange={() => setSauce([])} ></input>
                            <label htmlFor='소스 없음'>소스 없음</label>
                        </div>
                    </div>
                </div>

            </div>
            <RecipeNav>

            </RecipeNav>
        </main>
    );
};

export default AddRecipe;

export async function getServerSideProps(context) {
    // 서버에서 데이터를 불러올 수 있는 비동기 함수를 사용합니다.
    const param = context.query.param
    return {
        props: {
            param
        },
    };
}