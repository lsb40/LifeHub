import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

test('renders login page by default', () => {
  render(
    <TestWrapper>
      <App />
    </TestWrapper>
  );
  
  expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
});

test('renders demo credentials', () => {
  render(
    <TestWrapper>
      <App />
    </TestWrapper>
  );
  
  expect(screen.getByText(/Demo Credentials/i)).toBeInTheDocument();
  expect(screen.getByText(/admin@lifehub.com/i)).toBeInTheDocument();
  expect(screen.getByText(/user@lifehub.com/i)).toBeInTheDocument();
});
