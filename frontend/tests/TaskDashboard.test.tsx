// TaskDashboard.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskDashboard } from '../src/pages/tasks/task-dashboard';
import { useTasks } from '../src/hooks/pre-fetch';

// Mock the useTasks hook as a jest mock function
jest.mock('../src/hooks/pre-fetch', () => ({
  useTasks: jest.fn(),
}));

const queryClient = new QueryClient();

describe('TaskDashboard', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    // Set default mock return values
    (useTasks as jest.Mock).mockReturnValue({
      tasks: [],
      isLoading: false,
      error: null,
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    });
  });

  test('renders loading state', () => {
    (useTasks as jest.Mock).mockReturnValueOnce({
      tasks: [],
      isLoading: true,
      error: null,
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TaskDashboard />
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading tasks.../i)).toBeInTheDocument();
  });

  test('renders error state', () => {
    (useTasks as jest.Mock).mockReturnValueOnce({
      tasks: [],
      isLoading: false,
      error: 'Error loading tasks',
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TaskDashboard />
      </QueryClientProvider>
    );

    expect(screen.getByText(/error loading tasks/i)).toBeInTheDocument();
  });

  test('renders tasks when available', () => {
    (useTasks as jest.Mock).mockReturnValueOnce({
      tasks: [
        {
          id: '1',
          title: 'Test Task 1',
          description: 'Description 1',
          status: 'todo',
          priority: 'medium',
          due_date: '2023-10-01',
        },
        {
          id: '2',
          title: 'Test Task 2',
          description: 'Description 2',
          status: 'in-progress',
          priority: 'high',
          due_date: '2023-10-02',
        },
      ],
      isLoading: false,
      error: null,
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TaskDashboard />
      </QueryClientProvider>
    );

    expect(screen.getByText(/manage your tasks and track progress/i)).toBeInTheDocument();
    expect(screen.getByText(/test task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/test task 2/i)).toBeInTheDocument();
  });

  test('submits the task form', async () => {
    const mockCreateTask = jest.fn().mockResolvedValueOnce({});
    (useTasks as jest.Mock).mockReturnValueOnce({
      tasks: [],
      isLoading: false,
      error: null,
      createTask: mockCreateTask,
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TaskDashboard />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId('add-task-button'));

    fireEvent.change(screen.getByTestId("input-title"), {
      target: { value: "New Task" },
    });
    
    fireEvent.change(screen.getByTestId("input-description"), {
      target: { value: "New Task Description" },
    });
    
    
    
    fireEvent.change(screen.getByTestId("input-due-date"), {
      target: { value: "2023-10-10" },
    });
    
    fireEvent.click(screen.getByTestId("submit-task"));

  
  });
});
