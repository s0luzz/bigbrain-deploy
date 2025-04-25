import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import { describe, it, expect } from 'vitest';

describe('Login Component', () => {
  it('renders input fields and login button', () => {
    render(
      <MemoryRouter>
        <Login setfunction={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('shows error on empty fields submission', async () => {
    render(
      <MemoryRouter>
        <Login setfunction={() => {}} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(await screen.findByText('Email and password are required.')).toBeInTheDocument();
  });
});
