//메뉴 배열
export type menuArrayType = {
    name: string,
    image: string,
    favorit: number, 
    recipes: number, 
    avgRecipe: number, 
    ingredients: Array<string>, 
    matches?: Array<any>, 
    type: number, 
    summary: string
}

export const menuArray: menuArrayType[] = [
    { name: '로스티드 치킨', image: '/images/sandwich_menu/Roasted-Chicken_20211231095032718.png', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '오븐에 구워 담백한 저칼로리 닭가슴살의 건강한 풍미', ingredients: ['치킨 브레스트.jpg', '아메리칸 치즈.jpg', '스위트어니언.jpg', '올리브오일.jpg'] },
    { name: '로티세리 바베큐', image: '/images/sandwich_menu/Rotisserie-Barbecue-Chicken_20211231023137878.png', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '촉촉한 바비큐 치킨의 풍미가득.\n 손으로 찢어 더욱 부드러운 치킨의 혁명', ingredients: ['로티세리 치킨.jpg', '아메리칸 치즈.jpg', '스위트칠리.jpg', '랜치.jpg'] },
    { name: '베지', image: '/images/sandwich_menu/Veggie-Delite_20211231095658375.png', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '갓 구운 빵과 신선한 8가지 야채로 즐기는 깔끔한 한끼', ingredients: ['각종 야채.jpg', '아메리칸 치즈.jpg', '레드와인식초.jpg', '올리브오일.jpg'] },
    { name: '서브웨이 클럽', image: '/images/sandwich_menu/Subway-Club™_20211231095518589.png', favorit: 2, recipes: 1, avgRecipe: 5, type: 2, summary: '고소한 베이컨, 담백한 치킨 슬라이스에 햄까지 더해\n 완벽해진 조화를 즐겨보세요!', ingredients: ['치킨 브레스트 햄.jpg', '햄.jpg', '베이컨.jpg', '아메리칸 치즈.jpg', '랜치.jpg', '스위트어니언.jpg'] },
    { name: '스파이시 쉬림프', image: '/images/sandwich_menu/치킨슬라이스샌드위치_20220804012537491.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '탱글한 쉬림프에 이국적인 시즈닝을 더해 색다른 매콤함을 만나보세요!', ingredients: ['스파이시 쉬림프.jpg', '아메리칸 치즈.jpg', '랜치.jpg'] },
    { name: '스파이시 바베큐', image: '/images/sandwich_menu/스파이시바비큐_정면_20221031041334845.png', favorit: 4, recipes: 1, avgRecipe: 1, type: 4, summary: '부드러운 풀드포크에 매콤한 맛을 더했다!\n 올 겨울 자꾸만 생각 날 매콤한 맛을 써브웨이 스파이시 바비큐로 만나보세요!', ingredients: ['스파이시 바비큐.jpg', '아메리칸 치즈.jpg', '마요네즈.jpg', '뉴 사우스웨스트 치폴레.jpg'] },
    { name: '스파이시 이탈리안', image: '/images/sandwich_menu/spicy_italian_20211231095435532.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '페퍼로니 & 살라미가 입안 가득,\n 페퍼로니의 부드러운 매콤함을 만나보세요!', ingredients: ['페퍼로니.jpg', '살라미.jpg', '아메리칸 치즈.jpg', '랜치.jpg', '스위트어니언.jpg'] },
    { name: '스테이크 & 치즈', image: '/images/sandwich_menu/Steak-&-Cheese_20211231095455613.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '육즙이 쫙~풍부한 비프 스테이크의 풍미가 입안 한가득', ingredients: ['스테이크.jpg', '아메리칸 치즈.jpg', '뉴 사우스웨스트 치폴레.jpg', '마요네즈.jpg'] },
    { name: '쉬림프', image: '/images/sandwich_menu/Shrimp_20211231095411189.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '탱글한 쉬림프 5마리가 그대로,\n 신선하고 담백한 쉬림프의 맛 그대로 즐겨보세요!', ingredients: ['새우.jpg', '아메리칸 치즈.jpg', '랜치.jpg', '스위트칠리.jpg'] },
    { name: '이탈리안 B.M.T', image: '/images/sandwich_menu/Italian_B.M.T_20211231094910899.png', favorit: 1, recipes: 4, avgRecipe: 4, type: 1, summary: '페퍼로니, 살라미 그리고 햄이 만들어내는 최상의 조화!\n 전세계가 사랑하는 써브웨이의 베스트셀러!\n Biggest Meatiest Tastiest, its’ B.M.T.', ingredients: ['페퍼로니.jpg', '살라미.jpg', '햄.jpg', '아메리칸 치즈.jpg', '스위트어니언.jpg', '랜치.jpg'] },
    { name: '에그마요', image: '/images/sandwich_menu/Egg-Mayo_20211231094817112.png', favorit: 1, recipes: 1, avgRecipe: 1, type: 1, summary: '부드러운 달걀과 고소한 마요네즈가\n 만나 더 부드러운 스테디셀러', ingredients: ['에그마요.jpg', '아메리칸 치즈.jpg', '랜치.jpg', '스위트칠리.jpg'] },
    { name: '참치', image: '/images/sandwich_menu/Tuna_20211231095535268.png', favorit: 1, recipes: 1, avgRecipe: 1, type: 1, summary: '남녀노소 누구나 좋아하는 담백한 참치와\n 고소한 마요네즈의 완벽한 조화', ingredients: ['참치.jpg', '아메리칸 치즈.jpg', '핫칠리.jpg', '스위트칠리.jpg'] },
    { name: '치킨 베이컨 아보카도', image: '/images/sandwich_menu/치킨베이컨아보카도샌드위치_20220804012954461.png', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '담백하게 닭가슴살로 만든 치킨 슬라이스와\n 베이컨, 부드러운 아보카도의 만남', ingredients: ['치킨 브레스트 햄.jpg', '베이컨.jpg', '아보카도.jpg', '아메리칸 치즈.jpg', '랜치.jpg', '홀스래디쉬.jpg'] },
    { name: '치킨 슬라이스', image: '/images/sandwich_menu/치킨슬라이스샌드위치_20220804012537491.png', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '닭가슴살로 만든 치킨 슬라이스로 즐기는 담백한 맛!', ingredients: ['치킨 브레스트 햄.jpg', '아메리칸 치즈.jpg', '스위트칠리.jpg', '뉴 사우스웨스트 치폴레.jpg'] },
    { name: '치킨 데리야끼', image: '/images/sandwich_menu/Chicken-Teriyaki_20211231094803381.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '담백한 치킨 스트립에\n 달콤짭쪼름한 써브웨이 특제 데리야끼 소스와의 환상적인 만남', ingredients: ['치킨 데리야끼.jpg', '아메리칸 치즈.jpg', '스모크바베큐.jpg', '마요네즈.jpg'] },
    { name: '풀드포크', image: '/images/sandwich_menu/Pulled-Pork+cheese_20211231095012512.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '미국 스타일의 풀드 포크 바비큐가 가득 들어간 샌드위치', ingredients: ['풀드포크 바비큐.jpg', '아메리칸 치즈.jpg', '스모크바베큐.jpg', '랜치.jpg'] },
    { name: '햄', image: '/images/sandwich_menu/Ham_20211231094833168.png', favorit: 1, recipes: 1, avgRecipe: 1, type: 1, summary: '풍부한 햄이 만들어내는 담백함을 입 안 가득 즐겨보세요!', ingredients: ['햄.jpg', '아메리칸 치즈.jpg', '마요네즈.jpg', '홀스래디쉬.jpg'] },
    { name: 'B.L.T', image: '/images/sandwich_menu/B.L.T_20211231094744175.png', favorit: 1, recipes: 1, avgRecipe: 1, type: 1, summary: '오리지널 아메리칸 스타일 베이컨의 풍미와 바삭함 그대로~', ingredients: ['베이컨.jpg', '아메리칸 치즈.jpg', '마요네즈.jpg', '뉴 사우스웨스트 치폴레.jpg'] },
    { name: 'K-bbq', image: '/images/sandwich_menu/K-BBQ_20211231094930225.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '써브웨이의 코리안 스타일 샌드위치!\n 마늘, 간장 그리고 은은한 불맛까지!', ingredients: ['k-바비큐.jpg', '아메리칸 치즈.jpg', '올리브오일.jpg', '후추.jpg'] },
];