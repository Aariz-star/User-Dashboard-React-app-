import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Dashboard from './Dashboard';

jest.mock('axios');

const mockUser = { id: 1, username: 'testuser' };
const mockTasks = [
  { id: 1, title: 'Task 1', description: 'Desc 1', status: 'pending' },
  { id: 2, title: 'Task 2', description: 'Desc 2', status: 'completed' }
];
const mockProfile = { username: 'testuser', full_name: 'Test User', bio: 'Hello' };

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Mock GET requests for tasks and profile
    axios.get.mockImplementation((url) => {
      if (url.includes('tasks.php')) return Promise.resolve({ data: mockTasks });
      if (url.includes('profile.php')) return Promise.resolve({ data: mockProfile });
      return Promise.reject(new Error('not found'));
    });
  });

  test('renders tasks and profile data', async () => {
    render(<Dashboard user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  test('adds a new task', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    render(<Dashboard user={mockUser} />);

    fireEvent.change(screen.getByPlaceholderText('New Task Title...'), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('Add Task'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/tasks.php'), expect.objectContaining({
        title: 'New Task',
        user_id: 1
      }));
    });
  });

  test('deletes a task', async () => {
    axios.delete.mockResolvedValue({ data: { success: true } });
    render(<Dashboard user={mockUser} />);

    await waitFor(() => screen.getByText('Task 1'));

    const deleteBtns = screen.getAllByText('Delete');
    fireEvent.click(deleteBtns[0]);

    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
  });
});