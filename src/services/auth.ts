import { z } from 'zod';

const API_URL = 'http://localhost:5000/api';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type LoginData = z.infer<typeof loginSchema>;

export const login = async (data: LoginData) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  const result = await response.json();
  localStorage.setItem('token', result.token);
  return result;
};

export const logout = () => {
  localStorage.removeItem('token');
};