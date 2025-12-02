import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, deleteProduct as apiDeleteProduct, createProduct as apiCreateProduct, updateProduct as apiUpdateProduct } from '../services/api';

// Async thunks
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async ({ page = 1, limit = 10, search = '', minPrice = '', maxPrice = '', sortBy = 'name' }, { rejectWithValue, signal }) => {
    try {
      // Construct query string manually since fetchProducts in api.js only accepts page/limit
      // We need to update api.js to accept these filters or handle it here.
      // For now, let's update the service call to pass query params if we modify api.js later.
      // Wait, the current api.js fetchProducts only takes page and limit.
      // We will need to update api.js to support search/filter params on the backend first.
      // But for now, let's just use what we have and filter client side or update backend.
      // The user asked for Global Search & Filtering.
      // Let's assume we will update the backend to handle these, or we fetch all and filter client side (not ideal for "Global").
      // Given the prompt "Global Search", backend filtering is best.
      // Let's pass the params to the API service.
      
      const response = await fetchProducts(page, limit, search, minPrice, maxPrice, sortBy, signal);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await apiDeleteProduct(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await apiCreateProduct(productData);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateProduct(id, data);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    totalProducts: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    filters: {
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to page 1 on filter change
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    // Optimistic delete
    removeProductOptimistic: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      state.totalProducts -= 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalProducts;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { setFilters, setPage, removeProductOptimistic } = productSlice.actions;
export default productSlice.reducer;
