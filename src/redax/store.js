// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import adminAbilitiesReducer from './adminAbilitiesSlice';
import searchReducer from './searchSlice'; // ✅ qo‘shildi
import authReducer from './authSlice';
import usersSlice from './usersSlice'; // ✅ qo‘shildi

const store = configureStore({
  reducer: {
    adminAbilities: adminAbilitiesReducer , // ✅ adminAbilitiesReducer 
    search: searchReducer, // ✅ searchReducer
    auth: authReducer,
    users: usersSlice, // ✅ usersSlice
  }
});

export default store; // ✅ default export qildik
