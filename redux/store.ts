import { combineReducers, createStore } from '@reduxjs/toolkit';
import userReducer from './reducer/userReducer';
import pageReducer from './reducer/pageReducer';

const rootReducer = combineReducers({
  user: userReducer,
  page: pageReducer,
  // 다른 리듀서 추가
});


export type RootState = ReturnType<typeof rootReducer>;
const store = createStore(rootReducer);

export default store;