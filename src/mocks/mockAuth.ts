// Mock authentication service for testing when real API is unavailable
import { User, LoginData } from '../services/auth';

// Test user credentials - we'll accept any password for the test email in mock mode
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

// Simulated delay to mimic network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockLogin = async (data: LoginData): Promise<User> => {
  // Simulate network delay
  await delay(800);
  
  console.log('Mock login attempt with:', data.email);
  
  // In mock mode, we'll accept the test email with any password
  // Or any email with the test password
  if (data.email === TEST_EMAIL || data.password === TEST_PASSWORD) {
    const mockUser: User = {
      id: '1',
      email: data.email,
      name: 'Test User',
      token: 'mock-jwt-token-12345'
    };
    
    // Store mock auth data in localStorage
    localStorage.setItem('token', mockUser.token);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return mockUser;
  }
  
  // Simulate authentication failure with helpful message
  throw new Error(`Invalid email or password. In mock mode, use email: ${TEST_EMAIL} with any password, or any email with password: ${TEST_PASSWORD}`);
};

export const isMockingEnabled = true;

// Helper function to display mock credentials in the UI if needed
export const getMockCredentials = () => {
  return {
    email: TEST_EMAIL,
    password: TEST_PASSWORD
  };
};
