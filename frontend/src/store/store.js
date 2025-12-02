import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    dashboard: dashboardReducer,
  },
});
