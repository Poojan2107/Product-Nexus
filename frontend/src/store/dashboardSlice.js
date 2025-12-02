import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts } from '../services/api';

export const getDashboardStats = createAsyncThunk(
  'dashboard/getStats',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Fetch all products (limit 1000) for analytics
      const { search = '', minPrice = '', maxPrice = '', sortBy = 'name' } = filters;
      const response = await fetchProducts(1, 1000, search, minPrice, maxPrice, sortBy);
      const products = response.products;

      const totalProducts = products.length;
      const totalValue = products.reduce((sum, p) => sum + Number(p.price), 0);
      const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

      const categoryCounts = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {});

      const priceRanges = {
        "0-1k": 0,
        "1k-10k": 0,
        "10k-50k": 0,
        "50k+": 0,
      };
      products.forEach((p) => {
        const price = Number(p.price);
        if (price <= 1000) priceRanges["0-1k"]++;
        else if (price <= 10000) priceRanges["1k-10k"]++;
        else if (price <= 50000) priceRanges["10k-50k"]++;
        else priceRanges["50k+"]++;
      });

      return {
        totalProducts,
        totalValue,
        avgPrice,
        categoryCounts,
        priceRanges,
        products // Keep raw data for line chart
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalProducts: 0,
      totalValue: 0,
      avgPrice: 0,
      categoryCounts: {},
      priceRanges: {},
      products: []
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
