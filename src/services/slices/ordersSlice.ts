import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi, orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderState = {
  orders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderByNumber: TOrder | null;
  orderByNumberRequest: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orders: [],
  orderRequest: false,
  orderModalData: null,
  orderByNumber: null,
  orderByNumberRequest: false,
  error: null
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () =>
  getOrdersApi()
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.error.message || 'Не удалось загрузить заказы';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось оформить заказ';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderByNumberRequest = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumberRequest = false;
        state.orderByNumber = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderByNumberRequest = false;
        state.error = action.error.message || 'Не удалось загрузить заказ';
      });
  }
});

export const { clearOrderModal } = ordersSlice.actions;

export default ordersSlice.reducer;
