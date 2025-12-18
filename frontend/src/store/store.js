import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import dashboardReducer from './dashboardSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    dashboard: dashboardReducer,
    cart: cartReducer,
  },
});
