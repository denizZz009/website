/**
 * API utility for making authenticated requests to the PHP backend
 */

// Base API URL - Use environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';

/**
 * Get the stored access token
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Store authentication token
 */
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/**
 * Clear authentication token
 */
export const clearToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

/**
 * Make an authenticated API request
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Prepare headers
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !options.body?.toString().includes('FormData')) {
    headers.set('Content-Type', 'application/json');
  }

  // Add authorization header if token exists
  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle non-JSON responses
    if (response.status === 204) {
      return {} as T; // No content
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { status: "error", message: text };
      }
    }

    // Handle authentication errors (token issues)
    if (response.status === 401) {
      clearToken();
      window.location.href = '/auth/login'; // Redirect to login page
      throw new Error(data.message || 'Authentication failed');
    }

    // Handle other error responses
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data as T;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Form data API request helper
 */
export const formDataRequest = async <T>(
  endpoint: string,
  data: Record<string, any>
): Promise<T> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: formData,
  });
};

/**
 * API endpoints matching PHP backend
 */
export const api = {
  auth: {
    login: (email_or_username: string, password: string) =>
      formDataRequest<{
        status: string;
        token: string;
        expires: number;
      }>('/login.php', {
        email_or_username,
        password,
      }),
    register: (username: string, email: string, password: string) =>
      formDataRequest<{
        status: string;
        message: string;
      }>('/register.php', {
        username,
        email,
        password,
      }),
    forgotPassword: (email: string) =>
      formDataRequest<{
        status: string;
        message: string;
      }>('/forgot_password.php', {
        email,
      }),
    resetPassword: (token: string, new_password: string) =>
      formDataRequest<{
        status: string;
        message: string;
      }>('/reset_password.php', {
        token,
        new_password,
      }),
    confirmEmail: (token: string) =>
      apiRequest<{
        status: string;
        message: string;
      }>(`/confirm.php?token=${token}`, {
        method: 'GET',
      }),
    changePassword: (current_password: string, new_password: string) =>
      formDataRequest<{
        status: string;
        message: string;
      }>('/change_password.php', {
        current_password,
        new_password,
      }),
  },
  user: {
    getProfile: () =>
      apiRequest<{
        status: string;
        user: {
          id: string;
          username: string;
          email: string;
          phone: string;
          address: string;
        }
      }>('/profile.php', {
        method: 'GET',
      }),
    updateProfile: (userData: { username?: string; email?: string; phone?: string; address?: string }) =>
      formDataRequest<{
        status: string;
        message: string;
        user: {
          id: string;
          username: string;
          email: string;
          phone: string;
          address: string;
        }
      }>('/update_profile.php', userData),
    requestEmailVerification: (email: string) =>
      formDataRequest<{
        status: string;
        message: string;
      }>('/request_email_verification.php', {
        email,
      }),
    verifyEmailUpdate: (token: string, email: string) =>
      formDataRequest<{
        status: string;
        message: string;
      }>('/verify_email_update.php', {
        token,
        email,
      }),
  },
  products: {
    getAll: () =>
      apiRequest<{
        status: string;
        products: Array<{
          id: string;
          name: string;
          price: number;
          description: string;
          stock: number;
        }>
      }>('/products.php', {
        method: 'GET',
      }),
    getById: (id: string) =>
      apiRequest<{
        status: string;
        product: {
          id: string;
          name: string;
          price: number;
          description: string;
          stock: number;
        }
      }>(`/product.php?id=${id}`, {
        method: 'GET',
      }),
  },
  orders: {
    checkout: (product_id: number, quantity: number) =>
      formDataRequest<{
        status: string;
        checkout_url: string;
      }>('/checkout.php', {
        product_id,
        quantity,
      }),
    purchase: (product_id: number, quantity: number) =>
      formDataRequest<{
        status: string;
        message: string;
        total_price: number;
      }>('/purchase.php', {
        product_id,
        quantity,
      }),
    getUserOrders: () =>
      apiRequest<{
        status: string;
        orders: Array<{
          id: string;
          date: string;
          total: string;
          status: string;
          items: Array<{
            name: string;
            quantity: number;
            price: string;
          }>
        }>
      }>('/user_orders.php', {
        method: 'GET',
      }),
  },
  admin: {
    // Admin specific API calls
    getProducts: () =>
      apiRequest<{
        status: string;
        products: Array<{
          id: string;
          name: string;
          price: number;
          description: string;
          stock: number;
          image: string;
          category_id: number;
          category_name: string;
          brand: string;
        }>
      }>('/products.php', {
        method: 'GET',
      }),

    getProduct: (id: string) =>
      apiRequest<{
        status: string;
        product: {
          id: string;
          name: string;
          price: number;
          description: string;
          stock: number;
          image: string;
          category_id: number;
          brand: string;
        }
      }>(`/product.php?id=${id}`, {
        method: 'GET',
      }),

    createProduct: (product: {
      name: string;
      price: number;
      description?: string;
      stock: number;
      image?: string;
      category_id: number;
      brand?: string;
    }) =>
      apiRequest<{
        status: string;
        message: string;
        product_id: string;
      }>('/products.php', {
        method: 'POST',
        body: JSON.stringify(product),
      }),

    updateProduct: (id: string, product: {
      name?: string;
      price?: number;
      description?: string;
      stock?: number;
      image?: string;
      category_id?: number;
      brand?: string;
    }) =>
      apiRequest<{
        status: string;
        message: string;
      }>(`/products.php?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
      }),

    deleteProduct: (id: string) =>
      apiRequest<{
        status: string;
        message: string;
      }>(`/products.php?id=${id}`, {
        method: 'DELETE',
      }),

    getCategories: () =>
      apiRequest<{
        status: string;
        categories: Array<{
          id: string;
          name: string;
          slug: string;
          description: string;
          image: string;
          product_count: number;
        }>
      }>('/categories.php', {
        method: 'GET',
      }),

    getCategory: (id: string) =>
      apiRequest<{
        status: string;
        category: {
          id: string;
          name: string;
          slug: string;
          description: string;
          image: string;
          product_count: number;
        }
      }>(`/categories.php?id=${id}`, {
        method: 'GET',
      }),

    createCategory: (category: {
      name: string;
      slug: string;
      description?: string;
      image?: string;
    }) =>
      apiRequest<{
        status: string;
        message: string;
        category_id: string;
      }>('/categories.php', {
        method: 'POST',
        body: JSON.stringify(category),
      }),

    updateCategory: (id: string, category: {
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
    }) =>
      apiRequest<{
        status: string;
        message: string;
      }>(`/categories.php?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(category),
      }),

    deleteCategory: (id: string) =>
      apiRequest<{
        status: string;
        message: string;
      }>(`/categories.php?id=${id}`, {
        method: 'DELETE',
      }),
  }
};
