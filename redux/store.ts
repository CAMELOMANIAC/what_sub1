import { combineReducers, createStore } from '@reduxjs/toolkit';
import userReducer from './reducer/userReducer';

const rootReducer = combineReducers({
  user: userReducer,
  // 다른 리듀서 추가
});


export type RootState = ReturnType<typeof rootReducer>;
const store = createStore(rootReducer);

export default store;