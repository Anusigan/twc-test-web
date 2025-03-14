import { z } from 'zod';
import { mockLogin, isMockingEnabled } from '../mocks/mockAuth';

// Allow configurable API URL from environment variables if available
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Define User type
export interface User {
  id: string;
  email: string;
  name?: string; // Make name optional as it might not be returned by all APIs
  token?: string;
  role?: string;
}

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type LoginData = z.infer<typeof loginSchema>;

export const login = async (data: LoginData): Promise<User> => {
  // Use mock login if mocking is enabled or if we detect API issues
  if (isMockingEnabled) {
    console.log('Using mock authentication service');
    return mockLogin(data);
  }
  
  try {
    console.log(`Attempting to connect to API at: ${API_URL}/api/auth/login`);
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // Include cookies if your API uses cookie-based auth
      mode: 'cors', // Add mode: 'cors' to explicitly enable CORS
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('API endpoint not found. Please check server configuration.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed with status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Store token and user data
    if (result.token) {
      localStorage.setItem('token', result.token);
    }
    
    const userData = result.user || result;
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Login error details:', error);
    
    // If we hit a network error, fallback to mock if available
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Network error detected. Falling back to mock authentication');
      return mockLogin(data);
    }
    
    // More detailed error handling
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.log('Network error detected. API server may not be running.');
      
      // Check if it's actually running on a different port by attempting to fetch
      try {
        await Promise.race([
          fetch(`${API_URL}/health`),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
        ]);
      } catch {
        return Promise.reject(
          new Error(`Unable to connect to the server at ${API_URL}. Please check that:
1. The API server is running
2. The correct port is being used (currently set to ${API_URL})
3. There are no CORS issues preventing the connection
4. Check browser console for additional error information`)
        );
      }
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current authenticated user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};