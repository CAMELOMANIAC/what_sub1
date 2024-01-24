// 액션 타입 정의
const SET_FILTER_TYPE = 'ACTION_SET_FILTER_TYPE';
const ADD_FILTER_TYPE = 'ACTION_ADD_FILTER_TYPE';
const SET_VISIBLE_TYPE = 'ACTION_SET_VISIBLE_TYPE';

type pageStateType = {
  FILTER_ARRAY: string[],
  VISIBLE_ARRAY: string[],
}

// 초기 상태 정의
const initialState: pageStateType = {
  FILTER_ARRAY: ['메뉴이름', '레시피제목', '작성자', '재료', '태그'],
  VISIBLE_ARRAY: ['미트', '치즈', '소스'],
};

// 리듀서 정의
const pageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER_TYPE:
      return {
        ...state,
        FILTER_ARRAY: action.payload
      };
    case ADD_FILTER_TYPE:
      return {
        ...state,
        FILTER_ARRAY: [...state.FILTER_ARRAY, action.payload]
      };
    case SET_VISIBLE_TYPE:
      return {
        ...state,
        FILTER_ARRAY: action.payload
      };
    default:
      return state;
  }
};

export const set_filter_action = (filter) => ({
  type: SET_FILTER_TYPE,
  payload: filter
})
export const add_Filter_action = (filter) => ({
  type: ADD_FILTER_TYPE,
  payload: filter
})
export const set_visible_action = (filter) => ({
  type: ADD_FILTER_TYPE,
  payload: filter
})


export default pageReducer;