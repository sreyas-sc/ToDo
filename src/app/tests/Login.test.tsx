import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../pages/Login/page';
import axios from 'axios';
import { jest } from '@jest/globals';

// Type augmentation for axios mock
jest.mock('axios', () => ({
  post: jest.fn()
}));

// Get the mocked axios
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Login Component', () => {
  beforeEach(() => {
    // Clear mocks and localStorage before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render login form and handle submit', async () => {
    // Setup mock response
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'fake-token', userId: 'user123' }
    });

    render(<Login />);

    // Check if the login form is rendered
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Wait for the async operations to complete
    await screen.findByText(/success/i);

    // Assertions for successful login
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('userId')).toBe('user123');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        email: 'test@example.com',
        password: 'password123'
      })
    );
  });

  it('should show error message on login failure', async () => {
    // Setup mock error response
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: { message: 'Invalid credentials' }
      }
    });

    render(<Login />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Wait for error message to appear
    const errorMessage = await screen.findByText(/invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });
});