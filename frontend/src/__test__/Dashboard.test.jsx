import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  it('renders Dashboard without crashing', () => {
    render(
      <MemoryRouter>
        <Dashboard
          token="dummy-token"
          setfunction={() => {}}
          setsessions={() => {}}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Your Games')).toBeInTheDocument();
  });
});
