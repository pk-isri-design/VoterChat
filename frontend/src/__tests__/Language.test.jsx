import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ChatInterface from '../components/ChatInterface';
import { translations } from '../utils/translations';

describe('Language Change Test', () => {
  const mockUser = { email: 'test@example.com', displayName: 'Test User' };

  beforeAll(() => {
    window.speechSynthesis = {
      cancel: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn(() => [])
    };
  });

  it('renders default language (English)', () => {
    render(<ChatInterface user={mockUser} />);
    // Welcome message in English
    expect(screen.getByText(translations['en-IN'].welcome)).toBeInTheDocument();
    // Default tabs in English
    expect(screen.getByText('Register as Voter')).toBeInTheDocument();
  });

  it('changes language to Hindi and updates UI', () => {
    render(<ChatInterface user={mockUser} />);
    
    // Find the language select dropdown
    const languageSelect = screen.getByTitle('Change App Language');
    
    // Change to Hindi
    fireEvent.change(languageSelect, { target: { value: 'hi-IN' } });
    
    // Welcome message should update to Hindi
    expect(screen.getByText(translations['hi-IN'].welcome)).toBeInTheDocument();
    // Tab should update to Hindi
    expect(screen.getByText(translations['hi-IN'].tabs[0].label)).toBeInTheDocument();
  });
  
  it('changes language to Bengali and updates UI', () => {
    render(<ChatInterface user={mockUser} />);
    
    const languageSelect = screen.getByTitle('Change App Language');
    
    fireEvent.change(languageSelect, { target: { value: 'bn-IN' } });
    
    expect(screen.getByText(translations['bn-IN'].welcome)).toBeInTheDocument();
    expect(screen.getByText(translations['bn-IN'].tabs[0].label)).toBeInTheDocument();
  });
});
