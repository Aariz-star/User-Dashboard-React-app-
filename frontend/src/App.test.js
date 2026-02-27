import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';

// Mock child components to isolate App logic
jest.mock('./components/Login', () => ({ onLogin }) => (
  <div data-testid="login-component">
    <button onClick={() => onLogin({ id: 1, name: 'Test User' })}>Mock Login</button>
  </div>
));
jest.mock('./components/Dashboard', () => () => <div data-testid="dashboard-component">Dashboard</div>);

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders login screen by default', () => {
    render(<App />);
    expect(screen.getByText(/User Dashboard/i)).toBeInTheDocument();
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
  });

  test('renders dashboard when user is logged in via localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
    render(<App />);
    expect(screen.getByTestId('dashboard-component')).toBeInTheDocument();
  });

  test('logs out user correctly', async () => {
    // Start logged in
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
    render(<App />);
    
    const logoutBtn = screen.getByText(/Logout/i);
    fireEvent.click(logoutBtn);

    // Wait for logout animation/timeout
    await waitFor(() => {
      expect(screen.getByTestId('login-component')).toBeInTheDocument();
    });
    expect(localStorage.getItem('user')).toBeNull();
  });
});
