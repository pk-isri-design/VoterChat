import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AuthScreen from '../components/AuthScreen';
import { signInWithGoogle } from '../firebase';

// Mock Firebase
vi.mock('../firebase', () => ({
  auth: {},
  googleProvider: {},
  signInWithGoogle: vi.fn(),
}));

describe('AuthScreen Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login screen correctly', () => {
    render(<AuthScreen />);
    expect(screen.getByText('VoterHelp')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in with Google/i })).toBeInTheDocument();
  });

  it('calls signInWithGoogle on button click', async () => {
    signInWithGoogle.mockResolvedValueOnce({});
    render(<AuthScreen />);
    
    const loginButton = screen.getByRole('button', { name: /Sign in with Google/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signInWithGoogle).toHaveBeenCalledTimes(1);
    });
  });

  it('displays error message if login fails', async () => {
    signInWithGoogle.mockRejectedValueOnce(new Error('Popup closed'));
    render(<AuthScreen />);
    
    const loginButton = screen.getByRole('button', { name: /Sign in with Google/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to sign in: Popup closed')).toBeInTheDocument();
    });
  });
});
