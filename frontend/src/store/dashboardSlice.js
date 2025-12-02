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
        "0-50": 0,
        "51-100": 0,
        "101-200": 0,
        "201+": 0,
      };
      products.forEach((p) => {
        const price = Number(p.price);
        if (price <= 50) priceRanges["0-50"]++;
        else if (price <= 100) priceRanges["51-100"]++;
        else if (price <= 200) priceRanges["101-200"]++;
        else priceRanges["201+"]++;
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
