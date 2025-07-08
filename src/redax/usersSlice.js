import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://hosilbek02.pythonanywhere.com/api/';

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) {
      console.error('fetchUsers: Token topilmadi');
      return rejectWithValue('Tizimga kirish uchun token topilmadi. Iltimos, qayta kiring.');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}user/user-profiles/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('fetchUsers: Muvaffaqiyatli javob:', response.data);
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return rejectWithValue("Foydalanuvchilar ma'lumotlari topilmadi");
    } catch (error) {
      console.error('fetchUsers xatosi:', error.response?.status, error.response?.data);
      let errorMessage = 'Foydalanuvchilarni yuklashda xatolik yuz berdi';
      if (error.response?.status === 401) {
        errorMessage = 'Autentifikatsiya xatosi: Token yaroqsiz yoki muddati o‘tgan. Iltimos, qayta kiring.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to delete a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) {
      console.error('deleteUser: Token topilmadi');
      return rejectWithValue('Tizimga kirish uchun token topilmadi. Iltimos, qayta kiring.');
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}user/user-profiles/${userId}/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('deleteUser: Muvaffaqiyatli o‘chirildi:', userId);
      if (response.status === 204) {
        return userId;
      }
      return rejectWithValue('Foydalanuvchini o‘chirishda xatolik yuz berdi');
    } catch (error) {
      console.error('deleteUser xatosi:', error.response?.status, error.response?.data);
      let errorMessage = 'Foydalanuvchini o‘chirishda xatolik yuz berdi';
      if (error.response?.status === 401) {
        errorMessage = 'Autentifikatsiya xatosi: Token yaroqsiz yoki muddati o‘tgan. Iltimos, qayta kiring.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: '',
  },
  reducers: {
    clearError: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;