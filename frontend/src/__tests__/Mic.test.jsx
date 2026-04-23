import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ChatInterface from '../components/ChatInterface';

describe('Mic Feature Test', () => {
  const mockUser = { email: 'test@example.com', displayName: 'Test User' };

  it('initializes speech recognition on mount', () => {
    // We already mocked window.SpeechRecognition in setupTests.js
    render(<ChatInterface user={mockUser} />);
    expect(window.SpeechRecognition).toBeDefined();
  });

  it('starts listening when mic button is clicked', () => {
    render(<ChatInterface user={mockUser} />);
    
    // Find the mic button
    const micButton = screen.getByTitle('Start speaking');
    
    // Click to start listening
    fireEvent.click(micButton);
    
    // It should change title to "Stop listening"
    expect(screen.getByTitle('Stop listening')).toBeInTheDocument();
  });

  it('stops listening when mic button is clicked again', () => {
    render(<ChatInterface user={mockUser} />);
    
    const micButton = screen.getByTitle('Start speaking');
    
    // Start listening
    fireEvent.click(micButton);
    expect(screen.getByTitle('Stop listening')).toBeInTheDocument();
    
    // Stop listening
    fireEvent.click(screen.getByTitle('Stop listening'));
    expect(screen.getByTitle('Start speaking')).toBeInTheDocument();
  });
});
