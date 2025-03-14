import { z } from 'zod';

const API_URL = 'http://localhost:5000/api';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type LoginData = z.infer<typeof loginSchema>;

export const login = async (data: LoginData): Promise<User> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed with status: ${response.status}`);
    }
    
    const user = await response.json();
    // Store user in localStorage or context
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    // Check if it's a network error (failed to fetch)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection or try again later.');
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};