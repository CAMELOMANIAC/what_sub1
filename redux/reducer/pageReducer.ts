// 액션 타입 정의
const ACTION_SEARCH_HANDLER = 'ACTION_SEARCH_HANDLER';

// 초기 상태 정의
const initialState = {
    SEARCH_HANDLER: ''
};

// 리듀서 정의
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SEARCH_HANDLER:
      return {
        ...state,
        SEARCH_HANDLER: action.payload
      };
    default:
      return state;
  }
};

export const actionSearchHandler = (handler) => ({
  type: ACTION_SEARCH_HANDLER,
  payload: handler
})

export default userReducer;