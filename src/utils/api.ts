import { isMockingEnabled } from '../mocks/mockAuth';

// Ensure BASE_URL matches the one in auth.ts
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
}

// Utility to handle API requests with auth token
export const apiRequest = async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  // If mocking is enabled, warn about API calls that would normally go to the server
  if (isMockingEnabled) {
    console.warn(`Mock mode active: Real API call to ${endpoint} was prevented`);
    // You could extend this with mock data for specific endpoints
    return {} as T;
  }

  const token = localStorage.getItem('token');
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    credentials: options.credentials || 'include',
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  };

  try {
    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, config);
    
    if (!response.ok) {
      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      
      // Handle 404 Not Found
      if (response.status === 404) {
        throw new Error('API endpoint not found');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status: ${response.status}`);
    }
    
    // Check if response is empty
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {} as T;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
