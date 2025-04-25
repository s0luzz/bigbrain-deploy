import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../Register';
import { describe, it, expect } from 'vitest';

describe('Register Component', () => {
  it('renders form and inputs correctly', () => {
    render(
      <MemoryRouter>
        <Register setfunction={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('shows error if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <Register setfunction={() => {}} />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'name' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'mail@mail' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'pass123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'different' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument();
  });
});
