import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// DB path definitions
const DB_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const PRODUCTS_FILE = path.join(DB_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DB_DIR, 'categories.json');
const ORDERS_FILE = path.join(DB_DIR, 'orders.json');

// Types
export interface User {
  id: string;
  email: string;
  password: string; // In a real app, this would be hashed
  name: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categoryId: string;
  brand?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string | null; // Can be null for guest checkout
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    zipCode?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Initialize database if it doesn't exist
export const initDB = () => {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([
      {
        id: uuidv4(),
        email: 'admin@cikswear.com',
        password: 'admin123', // In a real app, this would be hashed
        name: 'Admin User',
        isAdmin: true,
        createdAt: new Date().toISOString()
      }
    ]));
  }

  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([
      {
        id: uuidv4(),
        name: 'Tommy Hilfiger Logo Tişört',
        description: 'Tommy Hilfiger logolu, %100 pamuklu premium erkek tişört',
        price: 349.90,
        stock: 42,
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop',
        categoryId: '1', // Referencing the tshirts category
        brand: 'Tommy Hilfiger',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Calvin Klein Essential Tişört',
        description: 'Calvin Klein minimal logolu, slim fit erkek tişört',
        price: 299.90,
        stock: 28,
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop',
        categoryId: '1', // Referencing the tshirts category
        brand: 'Calvin Klein',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]));
  }

  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify([
      {
        id: '1',
        name: 'Tişörtler',
        slug: 'tisortler',
        description: 'Tişört koleksiyonumuz',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=320&auto=format&fit=crop',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Ayakkabılar',
        slug: 'ayakkabilar',
        description: 'Ayakkabı koleksiyonumuz',
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=320&auto=format&fit=crop',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]));
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
  }
};

// CRUD operations for Users
export const getUsers = (): User[] => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

export const getUserById = (id: string): User | null => {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: uuidv4(),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users));
  return newUser;
};

export const updateUser = (id: string, userData: Partial<User>): User | null => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);

  if (index === -1) return null;

  users[index] = { ...users[index], ...userData };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users));
  return users[index];
};

export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);

  if (filteredUsers.length === users.length) return false;

  fs.writeFileSync(USERS_FILE, JSON.stringify(filteredUsers));
  return true;
};

// CRUD operations for Products
export const getProducts = (): Product[] => {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

export const getProductById = (id: string): Product | null => {
  const products = getProducts();
  return products.find(product => product.id === id) || null;
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  const products = getProducts();
  return products.filter(product => product.categoryId === categoryId);
};

export const createProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const products = getProducts();
  const now = new Date().toISOString();
  const newProduct: Product = {
    ...productData,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  };

  products.push(newProduct);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products));
  return newProduct;
};

export const updateProduct = (id: string, productData: Partial<Product>): Product | null => {
  const products = getProducts();
  const index = products.findIndex(product => product.id === id);

  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...productData,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products));
  return products[index];
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filteredProducts = products.filter(product => product.id !== id);

  if (filteredProducts.length === products.length) return false;

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filteredProducts));
  return true;
};

// CRUD operations for Categories
export const getCategories = (): Category[] => {
  try {
    const data = fs.readFileSync(CATEGORIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
};

export const getCategoryById = (id: string): Category | null => {
  const categories = getCategories();
  return categories.find(category => category.id === id) || null;
};

export const getCategoryBySlug = (slug: string): Category | null => {
  const categories = getCategories();
  return categories.find(category => category.slug === slug) || null;
};

export const createCategory = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category => {
  const categories = getCategories();
  const now = new Date().toISOString();
  const newCategory: Category = {
    ...categoryData,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  };

  categories.push(newCategory);
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories));
  return newCategory;
};

export const updateCategory = (id: string, categoryData: Partial<Category>): Category | null => {
  const categories = getCategories();
  const index = categories.findIndex(category => category.id === id);

  if (index === -1) return null;

  categories[index] = {
    ...categories[index],
    ...categoryData,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories));
  return categories[index];
};

export const deleteCategory = (id: string): boolean => {
  const categories = getCategories();
  const filteredCategories = categories.filter(category => category.id !== id);

  if (filteredCategories.length === categories.length) return false;

  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(filteredCategories));
  return true;
};

// CRUD operations for Orders
export const getOrders = (): Order[] => {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
};

export const getOrderById = (id: string): Order | null => {
  const orders = getOrders();
  return orders.find(order => order.id === id) || null;
};

export const getOrdersByUser = (userId: string): Order[] => {
  const orders = getOrders();
  return orders.filter(order => order.userId === userId);
};

export const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
  const orders = getOrders();
  const now = new Date().toISOString();
  const newOrder: Order = {
    ...orderData,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  };

  orders.push(newOrder);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders));
  return newOrder;
};

export const updateOrder = (id: string, orderData: Partial<Order>): Order | null => {
  const orders = getOrders();
  const index = orders.findIndex(order => order.id === id);

  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    ...orderData,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders));
  return orders[index];
};

export const deleteOrder = (id: string): boolean => {
  const orders = getOrders();
  const filteredOrders = orders.filter(order => order.id !== id);

  if (filteredOrders.length === orders.length) return false;

  fs.writeFileSync(ORDERS_FILE, JSON.stringify(filteredOrders));
  return true;
};

// Initialize the database on import
try {
  initDB();
} catch (error) {
  console.error('Error initializing database:', error);
}
