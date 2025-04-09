// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import adminAbilitiesReducer from './adminAbilitiesSlice';
import searchReducer from './searchSlice'; // ✅ qo‘shildi

const store = configureStore({
  reducer: {
    adminAbilities: adminAbilitiesReducer , // ✅ adminAbilitiesReducer 
    search: searchReducer // ✅ searchReducer
  }
});

export default store; // ✅ default export qildik
