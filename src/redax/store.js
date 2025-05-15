// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import adminAbilitiesReducer from './adminAbilitiesSlice';
import searchReducer from './searchSlice'; // ✅ qo‘shildi
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    adminAbilities: adminAbilitiesReducer , // ✅ adminAbilitiesReducer 
    search: searchReducer, // ✅ searchReducer
    auth: authReducer
  }
});

export default store; // ✅ default export qildik
