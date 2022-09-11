import { combineReducers} from 'redux';
import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { persistReducer } from 'redux-persist';
import userSlice  from "../page/userReduce";

const homeConfig = {
  key: 'homeSlide',
  storage,
};
const reducers = combineReducers({
   user : userSlice
});
const persistedReducer = persistReducer(homeConfig, reducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
})