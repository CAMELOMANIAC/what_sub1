export type recipeType = {
    recipe_id: string;
    recipe_name: string;
    recipe_ingredients: string;
    user_table_user_id: string;
    sandwich_table_sandwich_name: string;
    tag: string;
    reply_count: string;
    like_count: string;
}

export type replyType = {
    reply_id: number;
    reply_context: string;
    recipe_table_recipe_id: number;
    user_table_user_id: string;
}