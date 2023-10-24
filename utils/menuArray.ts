//메뉴 배열
export type menuArrayType = {
    name: string,
    favorit: number,
    recipes: number,
    avgRecipe: number,
    ingredients: Array<string>,
    matches?: Array<any>,
    type: number,
    summary: string
}

export const menuArray: menuArrayType[] = [
    { name: '로스티드 치킨', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '오븐에 구워 담백한 저칼로리 닭가슴살의 건강한 풍미', ingredients: ['치킨 브레스트.jpg', '아메리칸.jpg', '스위트어니언.jpg', '올리브오일.jpg'] },
    { name: '로티세리 바베큐', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '촉촉한 바비큐 치킨의 풍미가득.\n 손으로 찢어 더욱 부드러운 치킨의 혁명', ingredients: ['로티세리 치킨.jpg', '아메리칸.jpg', '스위트칠리.jpg', '랜치.jpg'] },
    { name: '베지', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '갓 구운 빵과 신선한 8가지 야채로 즐기는 깔끔한 한끼', ingredients: ['각종 야채.jpg', '아메리칸.jpg', '레드와인식초.jpg', '올리브오일.jpg'] },
    { name: '서브웨이 클럽', favorit: 2, recipes: 1, avgRecipe: 5, type: 2, summary: '고소한 베이컨, 담백한 치킨 슬라이스에 햄까지 더해\n 완벽해진 조화를 즐겨보세요!', ingredients: ['치킨 브레스트 햄.jpg', '햄.jpg', '베이컨.jpg', '아메리칸.jpg', '랜치.jpg', '스위트어니언.jpg'] },
    { name: '스파이시 쉬림프', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '탱글한 쉬림프에 이국적인 시즈닝을 더해 색다른 매콤함을 만나보세요!', ingredients: ['스파이시 쉬림프.jpg', '아메리칸.jpg', '랜치.jpg'] },
    { name: '스파이시 바베큐', favorit: 4, recipes: 1, avgRecipe: 1, type: 4, summary: '부드러운 풀드포크에 매콤한 맛을 더했다!\n 올 겨울 자꾸만 생각 날 매콤한 맛을 써브웨이 스파이시 바비큐로 만나보세요!', ingredients: ['스파이시 바비큐.jpg', '아메리칸.jpg', '마요네즈.jpg', '뉴 사우스웨스트 치폴레.jpg'] },
    { name: '스파이시 이탈리안', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '페퍼로니 & 살라미가 입안 가득,\n 페퍼로니의 부드러운 매콤함을 만나보세요!', ingredients: ['페퍼로니.jpg', '살라미.jpg', '아메리칸.jpg', '랜치.jpg', '스위트어니언.jpg'] },
    { name: '스테이크 & 치즈', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '육즙이 쫙~풍부한 비프 스테이크의 풍미가 입안 한가득', ingredients: ['스테이크.jpg', '아메리칸.jpg', '뉴 사우스웨스트 치폴레.jpg', '마요네즈.jpg'] },
    { name: '쉬림프', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '탱글한 쉬림프 5마리가 그대로,\n 신선하고 담백한 쉬림프의 맛 그대로 즐겨보세요!', ingredients: ['새우.jpg', '아메리칸.jpg', '랜치.jpg', '스위트칠리.jpg'] },
    { name: '이탈리안 B.M.T', favorit: 1, recipes: 4, avgRecipe: 4, type: 1, summary: '페퍼로니, 살라미 그리고 햄이 만들어내는 최상의 조화!\n 전세계가 사랑하는 써브웨이의 베스트셀러!\n Biggest Meatiest Tastiest, its’ B.M.T.', ingredients: ['페퍼로니.jpg', '살라미.jpg', '햄.jpg', '아메리칸.jpg', '스위트어니언.jpg', '랜치.jpg'] },
    { name: '에그마요', favorit: 1, recipes: 1, avgRecipe: 1, type: 1, summary: '부드러운 달걀과 고소한 마요네즈가\n 만나 더 부드러운 스테디셀러', ingredients: ['에그마요.jpg', '아메리칸.jpg', '랜치.jpg', '스위트칠리.jpg'] },
    { name: '참치', favorit: 1, recipes: 1, avgRecipe: 1, type: 1, summary: '남녀노소 누구나 좋아하는 담백한 참치와\n 고소한 마요네즈의 완벽한 조화', ingredients: ['참치.jpg', '아메리칸.jpg', '핫칠리.jpg', '스위트칠리.jpg'] },
    { name: '치킨 베이컨 아보카도', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '담백하게 닭가슴살로 만든 치킨 슬라이스와\n 베이컨, 부드러운 아보카도의 만남', ingredients: ['치킨 브레스트 햄.jpg', '베이컨.jpg', '아보카도.jpg', '아메리칸.jpg', '랜치.jpg', '홀스래디쉬.jpg'] },
    { name: '치킨 슬라이스', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '닭가슴살로 만든 치킨 슬라이스로 즐기는 담백한 맛!', ingredients: ['치킨 브레스트 햄.jpg', '아메리칸.jpg', '스위트칠리.jpg', '뉴 사우스웨스트 치폴레.jpg'] },
    { name: '치킨 데리야끼', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '담백한 치킨 스트립에\n 달콤짭쪼름한 써브웨이 특제 데리야끼 소스와의 환상적인 만남', ingredients: ['치킨 데리야끼.jpg', '아메리칸.jpg', '스모크바베큐.jpg', '마요네즈.jpg'] },
    { name: '풀드포크', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '미국 스타일의 풀드 포크 바비큐가 가득 들어간 샌드위치', ingredients: ['풀드포크 바비큐.jpg', '아메리칸.jpg', '스모크바베큐.jpg', '랜치.jpg'] },
    { name: '햄', favorit: 1, recipes: 1, avgRecipe: 1, type: 1, summary: '풍부한 햄이 만들어내는 담백함을 입 안 가득 즐겨보세요!', ingredients: ['햄.jpg', '아메리칸.jpg', '마요네즈.jpg', '홀스래디쉬.jpg'] },
    { name: 'B.L.T', favorit: 1, recipes: 1, avgRecipe: 1, type: 1, summary: '오리지널 아메리칸 스타일 베이컨의 풍미와 바삭함 그대로~', ingredients: ['베이컨.jpg', '아메리칸.jpg', '마요네즈.jpg', '뉴 사우스웨스트 치폴레.jpg'] },
    { name: 'K-bbq', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '써브웨이의 코리안 스타일 샌드위치!\n 마늘, 간장 그리고 은은한 불맛까지!', ingredients: ['k-바비큐.jpg', '아메리칸.jpg', '올리브오일.jpg', '후추.jpg'] },
];


export type nutrientsArrayType = {
    name: string,
    weight: number,
    kcal: number,
    protein: number,
    saturatedFats: number,
    sugars: number,
    sodium: number
}
const nutrientsArray: nutrientsArrayType[] = [
    { name: '화이트', weight: 71, kcal: 202, protein: 6.1, saturatedFats: 0.3, sugars: 2.8, sodium: 343 },
    { name: '파마산 오레가노', weight: 74.5, kcal: 213, protein: 6.3, saturatedFats: 0.4, sugars: 3.2, sodium: 489 },
    { name: '위트', weight: 78, kcal: 192, protein: 8.4, saturatedFats: 0.5, sugars: 5, sodium: 257 },
    { name: '허니오트', weight: 88.6, kcal: 235, protein: 8.8, saturatedFats: 0.6, sugars: 9.3, sodium: 306 },
    { name: '하티', weight: 75, kcal: 210, protein: 7, saturatedFats: 1, sugars: 3, sodium: 340 },
    { name: '플랫브레드', weight: 86, kcal: 233.5, protein: 8.1, saturatedFats: 8.5, sugars: 1.45, sodium: 468 },
    { name: '아메리칸치즈', weight: 10, kcal: 35.3, protein: 1.8, saturatedFats: 1.9, sugars: 0.4, sodium: 193 },
    { name: '슈레드치즈', weight: 14, kcal: 53.6, protein: 3.2, saturatedFats: 2.4, sugars: 0, sodium: 84.7 },
    { name: '모차렐라치즈', weight: 14, kcal: 43.8, protein: 2.8, saturatedFats: 2.1, sugars: 0.2, sodium: 82.3 },
    { name: '머스타드', weight: 21, kcal: 15.3, protein: 1.1, saturatedFats: 0.1, sugars: 0.2, sodium: 193 },
    { name: '레드 와인 식초', weight: 3.5, kcal: 0.7, protein: 0, saturatedFats: 0, sugars: 0, sodium: 0 },
    { name: '스위트 어니언', weight: 21, kcal: 40.1, protein: 0.1, saturatedFats: 0, sugars: 8.2, sodium: 81.7 },
    { name: '허니 머스타드', weight: 21, kcal: 38.4, protein: 0.4, saturatedFats: 0.4, sugars: 6.3, sodium: 145 },
    { name: '스위트 칠리', weight: 21, kcal: 40, protein: 0.1, saturatedFats: 0, sugars: 9.2, sodium: 163 },
    { name: '스모크 바베큐', weight: 21, kcal: 32.8, protein: 0.2, saturatedFats: 0.1, sugars: 7, sodium: 132 },
    { name: '랜치', weight: 21, kcal: 116, protein: 0.3, saturatedFats: 2.1, sugars: 0.6, sodium: 128 },
    { name: '마요네즈', weight: 21, kcal: 158, protein: 0.3, saturatedFats: 2.8, sugars: 0.1, sodium: 98.1 },
    { name: '핫 칠리', weight: 21, kcal: 41.8, protein: 0.2, saturatedFats: 0.1, sugars: 5.3, sodium: 180 },
    { name: '사우스웨스트 치폴레', weight: 21, kcal: 96.5, protein: 0.4, saturatedFats: 1.6, sugars: 1, sodium: 160 },
    { name: '홀스래디쉬', weight: 21, kcal: 106, protein: 0.3, saturatedFats: 1.6, sugars: 2.6, sodium: 152 },
    { name: '올리브 오일', weight: 3.5, kcal: 124, protein: 0, saturatedFats: 2.1, sugars: 0, sodium: 0 },

    //미트+채소
    { name: '스파이시 바비큐', weight: 178, kcal: 182, protein: 16.8, saturatedFats: 6.9, sugars: 10.0, sodium: 646 },
    { name: '스파이시 쉬림프', weight: 135, kcal: 53, protein: 8.1, saturatedFats: 0.4, sugars: 4.1, sodium: 313 },
    { name: '스파이시 이탈리안', weight: 146, kcal: 272, protein: 12.3, saturatedFats: 8.6, sugars: 3.7, sodium: 993 },
    { name: '스테이크 & 치즈', weight: 167, kcal: 163, protein: 19.7, saturatedFats: 3.7, sugars: 3.8, sodium: 523 },
    { name: '치킨 베이컨 아보카도', weight: 168, kcal: 163, protein: 11.8, saturatedFats: 2.7, sugars: 4, sodium: 683 },
    { name: '쉬림프', weight: 131, kcal: 49, protein: 7.9, saturatedFats: 0.1, sugars: 2.9, sodium: 158 },
    { name: '로스트 치킨', weight: 159, kcal: 108, protein: 17.6, saturatedFats: 0.8, sugars: 3.7, sodium: 348 },
    { name: '로티세리 바비큐 치킨', weight: 171, kcal: 135, protein: 20.7, saturatedFats: 2, sugars: 2.8, sodium: 285 },
    { name: 'K-바비큐', weight: 178, kcal: 180, protein: 17.2, saturatedFats: 1.6, sugars: 9.7, sodium: 642 },
    { name: '풀드 포크 바비큐', weight: 157, kcal: 135, protein: 16.4, saturatedFats: 1.6, sugars: 2.8, sodium: 432 },
    { name: '써브웨이 클럽', weight: 138, kcal: 107, protein: 11.4, saturatedFats: 1.9, sugars: 3.53, sodium: 596 },
    { name: '이탈리안 비엠티', weight: 150, kcal: 196, protein: 12.6, saturatedFats: 5.4, sugars: 3.6, sodium: 807 },
    { name: '치킨 슬라이스', weight: 143, kcal: 73, protein: 10.2, saturatedFats: 0.4, sugars: 3.7, sodium: 494 },
    { name: '참치', weight: 160, kcal: 124, protein: 18.5, saturatedFats: 0.9, sugars: 2.6, sodium: 278 },
    { name: '햄', weight: 142, kcal: 70, protein: 10.6, saturatedFats: 0.5, sugars: 3.4, sodium: 423 },
    { name: '베지', weight: 86, kcal: 17, protein: 0.8, saturatedFats: 0.1, sugars: 2.6, sodium: 5 },
    { name: '비엘티', weight: 104, kcal: 108, protein: 7.5, saturatedFats: 3.2, sugars: 2.9, sodium: 409 },
    { name: '치킨 데리야끼', weight: 177, kcal: 122, protein: 18.1, saturatedFats: 0.7, sugars: 5.1, sodium: 441 },
    { name: '에그마요', weight: 160, kcal: 224, protein: 8.0, saturatedFats: 4.3, sugars: 2.7, sodium: 297 }
];
