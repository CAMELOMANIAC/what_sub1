//메뉴 배열
export type menuArrayType = {
    name: string,
    favorit: number,
    recipes: number,
    likeRecipe: number,
    ingredients: Array<string>,
    matches?: Array<string>,
    type: number,
    summary: string
}

export const menuArray: menuArrayType[] = [
    { name: '로스티드 치킨', favorit: 0, recipes: 0, likeRecipe: 0, type: 2, summary: '오븐에 구워 담백한 저칼로리 닭가슴살의 건강한 풍미', ingredients: ['치킨 브레스트.jpg', '아메리칸.jpg', '스위트어니언.jpg', '올리브오일.jpg'] },
    { name: '로티세리 바베큐', favorit: 0, recipes: 0, likeRecipe: 0, type: 2, summary: '촉촉한 바비큐 치킨의 풍미가득.\n 손으로 찢어 더욱 부드러운 치킨의 혁명', ingredients: ['로티세리 치킨.jpg', '아메리칸.jpg', '스위트칠리.jpg', '랜치.jpg'] },
    { name: '베지', favorit: 0, recipes: 0, likeRecipe: 0, type: 2, summary: '갓 구운 빵과 신선한 8가지 야채로 즐기는 깔끔한 한끼', ingredients: ['각종 야채.jpg', '아메리칸.jpg', '레드와인식초.jpg', '올리브오일.jpg'] },
    { name: '서브웨이 클럽', favorit: 0, recipes: 0, likeRecipe: 0, type: 2, summary: '고소한 베이컨, 담백한 치킨 슬라이스에 햄까지 더해\n 완벽해진 조화를 즐겨보세요!', ingredients: ['치킨 브레스트 햄.jpg', '햄.jpg', '베이컨.jpg', '아메리칸.jpg', '랜치.jpg', '스위트어니언.jpg'] },
    { name: '스파이시 쉬림프', favorit: 0, recipes: 0, likeRecipe: 0, type: 3, summary: '탱글한 쉬림프에 이국적인 시즈닝을 더해 색다른 매콤함을 만나보세요!', ingredients: ['스파이시 쉬림프.jpg', '아메리칸.jpg', '랜치.jpg'] },
    { name: '스파이시 바베큐', favorit: 0, recipes: 0, likeRecipe: 0, type: 4, summary: '부드러운 풀드포크에 매콤한 맛을 더했다!\n 올 겨울 자꾸만 생각 날 매콤한 맛을 써브웨이 스파이시 바비큐로 만나보세요!', ingredients: ['스파이시 바비큐.jpg', '아메리칸.jpg', '마요네즈.jpg', '뉴 사우스웨스트 치폴레.jpg'] },
    { name: '스파이시 이탈리안', favorit: 0, recipes: 0, likeRecipe: 0, type: 3, summary: '페퍼로니 & 살라미가 입안 가득,\n 페퍼로니의 부드러운 매콤함을 만나보세요!', ingredients: ['페퍼로니.jpg', '살라미.jpg', '아메리칸.jpg', '랜치.jpg', '스위트어니언.jpg'] },
    { name: '스테이크 & 치즈', favorit: 0, recipes: 0, likeRecipe: 0, type: 3, summary: '육즙이 쫙~풍부한 비프 스테이크의 풍미가 입안 한가득', ingredients: ['스테이크.jpg', '아메리칸.jpg', '뉴 사우스웨스트 치폴레.jpg', '마요네즈.jpg'] },
    { name: '쉬림프', favorit: 0, recipes: 0, likeRecipe: 0, type: 3, summary: '탱글한 쉬림프 5마리가 그대로,\n 신선하고 담백한 쉬림프의 맛 그대로 즐겨보세요!', ingredients: ['새우.jpg', '아메리칸.jpg', '랜치.jpg', '스위트칠리.jpg'] },
    { name: '이탈리안 B.M.T', favorit: 0, recipes: 0, likeRecipe: 0, type: 1, summary: '페퍼로니, 살라미 그리고 햄이 만들어내는 최상의 조화!\n 전세계가 사랑하는 써브웨이의 베스트셀러!\n Biggest Meatiest Tastiest, its’ B.M.T.', ingredients: ['페퍼로니.jpg', '살라미.jpg', '햄.jpg', '아메리칸.jpg', '스위트어니언.jpg', '랜치.jpg'] },
    { name: '에그마요', favorit: 0, recipes: 0, likeRecipe: 0, type: 1, summary: '부드러운 달걀과 고소한 마요네즈가\n 만나 더 부드러운 스테디셀러', ingredients: ['에그마요.jpg', '아메리칸.jpg', '랜치.jpg', '스위트칠리.jpg'] },
    { name: '참치', favorit: 0, recipes: 0, likeRecipe: 0, type: 1, summary: '남녀노소 누구나 좋아하는 담백한 참치와\n 고소한 마요네즈의 완벽한 조화', ingredients: ['참치.jpg', '아메리칸.jpg', '핫칠리.jpg', '스위트칠리.jpg'] },
    { name: '치킨 베이컨 아보카도', favorit: 0, recipes: 0, likeRecipe: 0, type: 2, summary: '담백하게 닭가슴살로 만든 치킨 슬라이스와\n 베이컨, 부드러운 아보카도의 만남', ingredients: ['치킨 브레스트 햄.jpg', '베이컨.jpg', '아보카도.jpg', '아메리칸.jpg', '랜치.jpg', '홀스래디쉬.jpg'] },
    { name: '치킨 슬라이스', favorit: 0, recipes: 0, likeRecipe: 0, type: 2, summary: '닭가슴살로 만든 치킨 슬라이스로 즐기는 담백한 맛!', ingredients: ['치킨 브레스트 햄.jpg', '아메리칸.jpg', '스위트칠리.jpg', '뉴 사우스웨스트 치폴레.jpg'] },
    { name: '치킨 데리야끼', favorit: 0, recipes: 0, likeRecipe: 0, type: 3, summary: '담백한 치킨 스트립에\n 달콤짭쪼름한 써브웨이 특제 데리야끼 소스와의 환상적인 만남', ingredients: ['치킨 데리야끼.jpg', '아메리칸.jpg', '스모크바베큐.jpg', '마요네즈.jpg'] },
    { name: '풀드포크', favorit: 0, recipes: 0, likeRecipe: 0, type: 3, summary: '미국 스타일의 풀드 포크 바비큐가 가득 들어간 샌드위치', ingredients: ['풀드포크 바비큐.jpg', '아메리칸.jpg', '스모크바베큐.jpg', '랜치.jpg'] },
    { name: '햄', favorit: 0, recipes: 0, likeRecipe: 0, type: 1, summary: '풍부한 햄이 만들어내는 담백함을 입 안 가득 즐겨보세요!', ingredients: ['햄.jpg', '아메리칸.jpg', '마요네즈.jpg', '홀스래디쉬.jpg'] },
    { name: 'B.L.T', favorit: 0, recipes: 0, likeRecipe: 0, type: 1, summary: '오리지널 아메리칸 스타일 베이컨의 풍미와 바삭함 그대로~', ingredients: ['베이컨.jpg', '아메리칸.jpg', '마요네즈.jpg', '뉴 사우스웨스트 치폴레.jpg'] },
    { name: 'K-bbq', favorit: 0, recipes: 0, likeRecipe: 0, type: 3, summary: '써브웨이의 코리안 스타일 샌드위치!\n 마늘, 간장 그리고 은은한 불맛까지!', ingredients: ['k-바비큐.jpg', '아메리칸.jpg', '올리브오일.jpg', '후추.jpg'] },
];


export type nutrientsArrayType = {
    name: string,
    weight: number,
    kcal: number,
    protein: number,
    saturatedFats: number,
    sugars: number,
    sodium: number,
    summary?: string,
}

export const breadNutrientArray: nutrientsArrayType[] = [
    { name: '위트', weight: 78, kcal: 192, protein: 8.4, saturatedFats: 0.5, sugars: 5, sodium: 0.257, summary: '여러 가지 곡물로 만들어 건강하고 고소한 맛의 곡물빵' },
    { name: '파마산 오레가노', weight: 74.5, kcal: 213, protein: 6.3, saturatedFats: 0.4, sugars: 3.2, sodium: 0.489, summary: '부드러운 화이트빵에 파마산 오레가노 시즈닝을 묻혀 허브향 가득' },
    { name: '플랫브레드', weight: 86, kcal: 233.5, protein: 8.1, saturatedFats: 8.5, sugars: 1.45, sodium: 0.468, summary: '이름처럼 납작 모양에 피자도우처럼 쫀득한 맛이 일품' },
    { name: '하티', weight: 75, kcal: 210, protein: 7, saturatedFats: 1, sugars: 3, sodium: 0.340, summary: '부드러운 화이트빵에 옥수수가루를 묻혀 겉은 바삭하고 고소하며 속은 부드럽게' },
    { name: '화이트', weight: 71, kcal: 202, protein: 6.1, saturatedFats: 0.3, sugars: 2.8, sodium: 0.343, summary: '가장 클래식한 빵으로 부드러운 식감이 매력 포인트' },
    { name: '허니오트', weight: 88.6, kcal: 235, protein: 8.8, saturatedFats: 0.6, sugars: 9.3, sodium: 0.306, summary: '고소한 위트빵에 오트밀 가루를 묻혀 고소함과 식감이 두배로' },
]
export const cheeseNutrientArray: nutrientsArrayType[] = [
    { name: '아메리칸', weight: 10, kcal: 35.3, protein: 1.8, saturatedFats: 1.9, sugars: 0.4, sodium: 0.193 },
    { name: '슈레드', weight: 14, kcal: 53.6, protein: 3.2, saturatedFats: 2.4, sugars: 0, sodium: 0.0847 },
    { name: '모짜렐라', weight: 14, kcal: 43.8, protein: 2.8, saturatedFats: 2.1, sugars: 0.2, sodium: 0.0823 },
]
export const sauceNutrientArray: nutrientsArrayType[] = [
    { name: '머스타드', weight: 21, kcal: 15.3, protein: 1.1, saturatedFats: 0.1, sugars: 0.2, sodium: 0.193 },
    { name: '레드와인식초', weight: 3.5, kcal: 0.7, protein: 0, saturatedFats: 0, sugars: 0, sodium: 0 },
    { name: '스위트어니언', weight: 21, kcal: 40.1, protein: 0.1, saturatedFats: 0, sugars: 8.2, sodium: 0.0817 },
    { name: '허니머스타드', weight: 21, kcal: 38.4, protein: 0.4, saturatedFats: 0.4, sugars: 6.3, sodium: 0.145 },
    { name: '스위트칠리', weight: 21, kcal: 40, protein: 0.1, saturatedFats: 0, sugars: 9.2, sodium: 0.163 },
    { name: '스모크바베큐', weight: 21, kcal: 32.8, protein: 0.2, saturatedFats: 0.1, sugars: 7, sodium: 0.132 },
    { name: '랜치', weight: 21, kcal: 116, protein: 0.3, saturatedFats: 2.1, sugars: 0.6, sodium: 0.128 },
    { name: '마요네즈', weight: 21, kcal: 158, protein: 0.3, saturatedFats: 2.8, sugars: 0.1, sodium: 0.0981 },
    { name: '핫칠리', weight: 21, kcal: 41.8, protein: 0.2, saturatedFats: 0.1, sugars: 5.3, sodium: 0.180 },
    { name: '뉴 사우스웨스트 치폴레', weight: 21, kcal: 96.5, protein: 0.4, saturatedFats: 1.6, sugars: 1, sodium: 0.160 },
    { name: '홀스래디쉬', weight: 21, kcal: 106, protein: 0.3, saturatedFats: 1.6, sugars: 2.6, sodium: 0.152 },
    { name: '올리브오일', weight: 3.5, kcal: 124, protein: 0, saturatedFats: 2.1, sugars: 0, sodium: 0 },
]

export const menuNutrientArray: nutrientsArrayType[] = [
    //주메뉴=미트+채소
    { name: '스파이시 바베큐', weight: 178, kcal: 182, protein: 16.8, saturatedFats: 6.9, sugars: 10.0, sodium: 0.646 },
    { name: '스파이시 쉬림프', weight: 135, kcal: 53, protein: 8.1, saturatedFats: 0.4, sugars: 4.1, sodium: 0.313 },
    { name: '스파이시 이탈리안', weight: 146, kcal: 272, protein: 12.3, saturatedFats: 8.6, sugars: 3.7, sodium: 0.993 },
    { name: '스테이크 & 치즈', weight: 167, kcal: 163, protein: 19.7, saturatedFats: 3.7, sugars: 3.8, sodium: 0.523 },
    { name: '치킨 베이컨 아보카도', weight: 168, kcal: 163, protein: 11.8, saturatedFats: 2.7, sugars: 4, sodium: 0.683 },
    { name: '쉬림프', weight: 131, kcal: 49, protein: 7.9, saturatedFats: 0.1, sugars: 2.9, sodium: 0.158 },
    { name: '로스티드 치킨', weight: 159, kcal: 108, protein: 17.6, saturatedFats: 0.8, sugars: 3.7, sodium: 0.348 },
    { name: '로티세리 바베큐', weight: 171, kcal: 135, protein: 20.7, saturatedFats: 2, sugars: 2.8, sodium: 0.285 },
    { name: 'K-bbq', weight: 178, kcal: 180, protein: 17.2, saturatedFats: 1.6, sugars: 9.7, sodium: 0.642 },
    { name: '풀드포크', weight: 157, kcal: 135, protein: 16.4, saturatedFats: 1.6, sugars: 2.8, sodium: 0.432 },
    { name: '서브웨이 클럽', weight: 138, kcal: 107, protein: 11.4, saturatedFats: 1.9, sugars: 3.53, sodium: 0.596 },
    { name: '이탈리안 B.M.T', weight: 150, kcal: 196, protein: 12.6, saturatedFats: 5.4, sugars: 3.6, sodium: 0.807 },
    { name: '치킨 슬라이스', weight: 143, kcal: 73, protein: 10.2, saturatedFats: 0.4, sugars: 3.7, sodium: 0.494 },
    { name: '참치', weight: 160, kcal: 124, protein: 18.5, saturatedFats: 0.9, sugars: 2.6, sodium: 0.278 },
    { name: '햄', weight: 142, kcal: 70, protein: 10.6, saturatedFats: 0.5, sugars: 3.4, sodium: 0.423 },
    { name: '베지', weight: 86, kcal: 17, protein: 0.8, saturatedFats: 0.1, sugars: 2.6, sodium: 0.005 },
    { name: 'B.L.T', weight: 104, kcal: 108, protein: 7.5, saturatedFats: 3.2, sugars: 2.9, sodium: 0.409 },
    { name: '치킨 데리야끼', weight: 177, kcal: 122, protein: 18.1, saturatedFats: 0.7, sugars: 5.1, sodium: 0.441 },
    { name: '에그마요', weight: 160, kcal: 224, protein: 8.0, saturatedFats: 4.3, sugars: 2.7, sodium: 0.297 }
]

export const ingredientsArray = [
    { name: '에그마요 재료' },
    { name: '페퍼로니 재료' },
    { name: '베이컨 재료' },
    { name: '아보카도 재료' },
    { name: '오믈렛 재료' },
]

export const vegetableArray = [
    { name: '양상추' },
    { name: '토마토' },
    { name: '오이' },
    { name: '피망' },
    { name: '양파' },
]

export const pickleArray = [
    { name: '피클' },
    { name: '올리브' },
    { name: '할라피뇨' },
]