import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const ORDERS_API = 'https://hosilbek.pythonanywhere.com/api/user/orders/';
const PRODUCTS_API = 'https://hosilbek.pythonanywhere.com/user/api/product/';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Tizimga kirish uchun token topilmadi. Iltimos, qayta kiring.');
    }

    try {
      const orderRes = await axios.get(ORDERS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Orders API response:', orderRes.data); // Log the full response

      const ordersData = Array.isArray(orderRes.data) ? orderRes.data : [];

      const productIds = [
        ...new Set(
          ordersData
            .flatMap(order => order.order_items?.map(item => item.product) || [])
            .filter(id => id)
        ),
      ];
      console.log('Product IDs:', productIds);

      let productsMap = {};
      if (productIds.length > 0) {
        const productRes = await Promise.all(
          productIds.map(id =>
            axios.get(`${PRODUCTS_API}${id}/`, {
              headers: { Authorization: `Bearer ${token}` },
            }).catch(err => {
              console.error(`Error fetching product ${id}:`, err);
              return { data: null };
            })
          )
        );
        productsMap = productRes.reduce((map, res) => {
          if (res.data) map[res.data.id] = res.data;
          return map;
        }, {});
        console.log('Products map:', productsMap);
      }

      return { orders: ordersData, productsMap };
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (err.response) {
        console.log('Error response:', err.response.data); // Log error details
      }
      let errorMessage = 'Buyurtmalarni yuklashda xatolik yuz berdi.';
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data?.detail || 'Noto‘g‘ri so‘rov: Server ma’lumotlarni qayta ishlay olmadi.';
        } else if (err.response.status === 401) {
          errorMessage = 'Autentifikatsiya xatosi: Token yaroqsiz yoki muddati o‘tgan. Iltimos, qayta kiring.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    productsMap: {},
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
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.productsMap = action.payload.productsMap;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer;