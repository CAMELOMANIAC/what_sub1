// 액션 타입 정의
const ACTION_FILTER_HANDLER = 'ACTION_FILTER_HANDLER';

// 초기 상태 정의
const initialState = {
  FILTER_ARRAY: []
};

// 리듀서 정의
const pageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_FILTER_HANDLER:
      return {
        ...state,
        SEARCH_HANDLER: action.payload
      };
    default:
      return state;
  }
};

export const actionFilterHandler = (handler) => ({
  type: ACTION_FILTER_HANDLER,
  payload: handler
})

export default pageReducer;