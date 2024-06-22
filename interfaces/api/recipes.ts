export type recipeType = {
	recipe_id: string;
	recipe_name: string;
	recipe_ingredients: string;
	user_table_user_id: string;
	sandwich_table_sandwich_name: string;
	tag: string;
	reply_count: string;
	like_count: string;
};

export type replyType = {
	reply_id: number;
	reply_context: string;
	recipe_table_recipe_id: number;
	user_table_user_id: string;
};

export type userRecipeLikeTopDataType = {
	sandwich_table_sandwich_name: string;
	recipe_name: string;
	like_count: number;
};

export type getRecipesArg = {
	searchQuery: string;
	offset: number;
	limit: number;
	filter: string[];
	sort: string;
};

export enum filterType {
	menuName = '메뉴이름',
	recipeName = '레시피제목',
	writer = '작성자',
	ingredients = '재료',
	tag = '태그',
}
export enum visibleType {
	meat = '미트',
	cheese = '치즈',
	sauce = '소스',
	vegetable = '채소',
	bread = '빵',
	toasting = '토스팅',
}
