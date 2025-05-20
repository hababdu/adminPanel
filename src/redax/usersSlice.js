import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://hosilbek.pythonanywhere.com/api/';

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Tizimga kirish uchun token topilmadi. Iltimos, qayta kiring.');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}user/user-profiles/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return rejectWithValue("Foydalanuvchilar ma'lumotlari topilmadi");
    } catch (error) {
      let errorMessage = 'Foydalanuvchilarni yuklashda xatolik yuz berdi';
      if (error.response?.status === 401) {
        errorMessage = 'Autentifikatsiya xatosi: Token yaroqsiz yoki muddati o‘tgan. Iltimos, qayta kiring.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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
  async (userId, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Tizimga kirish uchun token topilmadi. Iltimos, qayta kiring.');
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}user/user-profiles/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204) {
        return userId;
      }
      return rejectWithValue('Foydalanuvchini o‘chirishda xatolik yuz berdi');
    } catch (error) {
      let errorMessage = 'Foydalanuvchini o‘chirishda xatolik yuz berdi';
      if (error.response?.status === 401) {
        errorMessage = 'Autentifikatsiya xatosi: Token yaroqsiz yoki muddati o‘tgan. Iltimos, qayta kiring.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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