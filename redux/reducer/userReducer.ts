// 액션 타입 정의
const ACTION_USER_LOGIN = 'ACTION_USER_LOGIN';
const ACTION_SET_RECIPE_LIKE = 'ACTION_SET_RECIPE_LIKE';
const ACTION_ADD_RECIPE_LIKE = 'ACTION_ADD_RECIPE_LIKE';
const ACTION_REMOVE_RECIPE_LIKE = 'ACTION_REMOVE_RECIPE_LIKE';

const ACTION_SET_MENU_LIKE = 'ACTION_SET_MENU_LIKE';
const ACTION_ADD_MENU_LIKE = 'ACTION_ADD_MENU_LIKE';
const ACTION_REMOVE_MENU_LIKE = 'ACTION_REMOVE_MENU_LIKE';

const ACTION_SET_LOGOUT_DATA = 'ACTION_SET_LOGOUT_DATA';

type userStateType = {
  userName: string,
  recipeLikeArray: string[],
  menuLikeArray: string[]
}

// 초기 상태 정의
const initialState: userStateType = {
  userName: '',
  recipeLikeArray: [],
  menuLikeArray: []
};

// 리듀서 정의
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_USER_LOGIN:
      return {
        ...state,
        userName: action.payload
      };

    case ACTION_SET_RECIPE_LIKE:
      return {
        ...state,
        recipeLikeArray: action.payload
      };

    case ACTION_ADD_RECIPE_LIKE:
      return {
        ...state,
        recipeLikeArray: [...state.recipeLikeArray, action.payload]
      };

    case ACTION_REMOVE_RECIPE_LIKE:
      return {
        ...state,
        recipeLikeArray: state.recipeLikeArray.filter(item=>item!==action.payload)
      };

    case ACTION_SET_MENU_LIKE:
      return {
        ...state,
        menuLikeArray: action.payload
      };

    case ACTION_ADD_MENU_LIKE:
      return {
        ...state,
        menuLikeArray: [...state.menuLikeArray, action.payload]
      };

    case ACTION_REMOVE_MENU_LIKE:
      return {
        ...state,
        menuLikeArray: state.menuLikeArray.filter(item=>item!==action.payload)
      };

    case ACTION_SET_LOGOUT_DATA:
      return initialState;

    default:
      return state;
  }
};

export const actionLoginChangeId = (userId: string) => ({
  type: ACTION_USER_LOGIN,
  payload: userId
})
export const actionAddRecipeLike = (recipeId: string) => ({
  type: ACTION_ADD_RECIPE_LIKE,
  payload: recipeId
})
export const actionRemoveRecipeLike = (recipeId: string) => ({
  type: ACTION_REMOVE_RECIPE_LIKE,
  payload: recipeId
})
export const actionSetRecipeLike = (recipeId: string[]) => ({
  type: ACTION_SET_RECIPE_LIKE,
  payload: recipeId
})
export const actionAddMenuLike = (menuId: string) => ({
  type: ACTION_ADD_MENU_LIKE,
  payload: menuId
})
export const actionRemoveMenuLike = (menuId: string) => ({
  type: ACTION_REMOVE_MENU_LIKE,
  payload: menuId
})
export const actionSetMenuLike = (menuId: string[]) => ({
  type: ACTION_SET_MENU_LIKE,
  payload: menuId
})
export const actionSetLogoutData = () => ({
  type: ACTION_SET_LOGOUT_DATA
})

export default userReducer;