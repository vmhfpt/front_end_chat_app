import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  _id : null,
  name : null,
  isLogin : false
}

export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    login: (state, action) => {
      state._id = action.payload.id;
      state.name = action.payload.name;
      state.isLogin = true;
    },
    logout: (state) => {
      state._id = null;
      state.name = null;
      state.isLogin = false;
    },
   
  },
})

export const { login, logout} = userSlice.actions

export default userSlice.reducer