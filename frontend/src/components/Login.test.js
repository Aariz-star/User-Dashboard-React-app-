import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Login from './Login';

jest.mock('axios');

describe('Login Component', () => {
  test('renders sign in form by default', () => {
    render(<Login onLogin={jest.fn()} />);
    // Both forms are in the DOM, so we check that inputs exist
    expect(screen.getAllByPlaceholderText('Email').length).toBeGreaterThan(0);
    expect(screen.getAllByPlaceholderText('Password').length).toBeGreaterThan(0);
    // Check for at least one Sign In button
    const signInButtons = screen.getAllByText('Sign In');
    expect(signInButtons.length).toBeGreaterThan(0);
  });

  test('handles login submission success', async () => {
    const mockOnLogin = jest.fn();
    // Mock successful API response
    axios.post.mockResolvedValue({ 
      data: { success: true, user: { id: 1, username: 'test' } } 
    });

    render(<Login onLogin={mockOnLogin} />);

    // Fill out form
    const emailInputs = screen.getAllByPlaceholderText('Email');
    const passwordInputs = screen.getAllByPlaceholderText('Password');
    fireEvent.change(emailInputs[1], { target: { value: 'test@test.com' } }); // Index 1 is the Sign In form
    fireEvent.change(passwordInputs[1], { target: { value: 'password' } });
    
    // Submit form (finding the button inside the form)
    const submitBtn = screen.getByText('Sign In', { selector: 'button[type="submit"]' });
    fireEvent.click(submitBtn);

    // Check if axios was called
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/login.php'), {
        email: 'test@test.com',
        password: 'password'
      });
    });
    
    // Wait for the component's internal timeout (500ms) to trigger onLogin
    await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledWith({ id: 1, username: 'test' });
    }, { timeout: 2000 });
  });

  test('handles login failure', async () => {
    axios.post.mockResolvedValue({ 
      data: { success: false, message: 'Invalid credentials' } 
    });

    render(<Login onLogin={jest.fn()} />);
    const submitBtn = screen.getByText('Sign In', { selector: 'button[type="submit"]' });
    fireEvent.click(submitBtn);

    await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument());
  });
});