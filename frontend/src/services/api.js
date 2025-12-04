const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  // Check if body is FormData
  const isFormData = options.body instanceof FormData;
  
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  
  // Only set Content-Type if NOT FormData (browser will set it automatically for FormData)
  if (!isFormData && options.headers?.['Content-Type'] !== undefined) {
    headers['Content-Type'] = options.headers['Content-Type'];
  } else if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Merge with any additional headers (except Content-Type for FormData)
  if (options.headers) {
    Object.keys(options.headers).forEach(key => {
      if (key !== 'Content-Type' || !isFormData) {
        headers[key] = options.headers[key];
      }
    });
  }
  
  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchProducts(page = 1, limit = 10, search = '', minPrice = '', maxPrice = '', sortBy = 'name', signal) {
  const query = new URLSearchParams({
    page,
    limit,
    search,
    minPrice,
    maxPrice,
    sortBy
  }).toString();
  return apiRequest(`/products?${query}`, { signal });
}

export async function fetchProduct(id) {
  return apiRequest(`/products/${id}`);
}

export async function createProduct(product) {
  return apiRequest('/products', {
    method: 'POST',
    body: product instanceof FormData ? product : JSON.stringify(product),
  });
}

export async function updateProduct(id, product) {
  return apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: product instanceof FormData ? product : JSON.stringify(product),
  });
}

export async function deleteProduct(id) {
  return apiRequest(`/products/${id}`, {
    method: 'DELETE',
  });
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function logoutUser() {
  return apiRequest('/auth/logout', {
    method: 'POST',
  });
}

export async function updateUserProfile(userId, userData) {
  return apiRequest(`/auth/update/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

export async function createOrder(order) {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

export async function getOrders() {
  return apiRequest('/orders');
}
