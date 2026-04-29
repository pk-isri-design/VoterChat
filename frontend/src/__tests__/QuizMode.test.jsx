import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QuizMode from '../components/QuizMode';

// Mock the logCustomEvent to prevent firebase init issues in tests
vi.mock('../firebase', () => ({
  logCustomEvent: vi.fn()
}));

describe('QuizMode Component', () => {
  it('renders the splash screen initially', () => {
    render(<QuizMode appLanguage="en-IN" />);
    expect(screen.getByText('Election Quiz')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Quiz/i })).toBeInTheDocument();
  });

  it('starts the quiz and displays the first question', () => {
    render(<QuizMode appLanguage="en-IN" />);
    
    // Click start
    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }));
    
    // Should be on Question 1 of 5
    expect(screen.getByText(/Question 1 of 5/i)).toBeInTheDocument();
    // Next button should be disabled initially
    expect(screen.getByRole('button', { name: /Next/i })).toBeDisabled();
  });

  it('translates splash screen text', () => {
    render(<QuizMode appLanguage="hi-IN" />);
    expect(screen.getByText('चुनाव प्रश्नोत्तरी')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /प्रश्नोत्तरी शुरू करें/i })).toBeInTheDocument();
  });
});
