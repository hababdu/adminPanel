import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null, // Dastlab localStorage'dan tokenni olish
    isAuthenticated: !!localStorage.getItem('token'),
    username: null,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.username = action.payload.username;
      localStorage.setItem('token', action.payload.token); // localStorage'ga saqlash
      console.log('Login muvaffaqiyatli:', { token: action.payload.token, username: action.payload.username });
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.username = null;
      localStorage.removeItem('token');
      console.log('Logout amalga oshirildi');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;