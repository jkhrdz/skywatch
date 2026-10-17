import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('App', () => {
  it('shows the departures board once flights arrive', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'SkyWatch' })).toBeInTheDocument();
    expect(await screen.findByText('Reykjavik', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('shows the theme toggle in the header', () => {
    const { container } = render(<App />);

    const header = container.querySelector('header');
    expect(within(header).getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
  });
});
