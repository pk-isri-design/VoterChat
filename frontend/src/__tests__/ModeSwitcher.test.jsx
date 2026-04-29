import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModeSwitcher from '../components/ModeSwitcher';

describe('ModeSwitcher Component', () => {
  it('renders all three mode buttons correctly', () => {
    render(<ModeSwitcher appMode="chat" setAppMode={vi.fn()} />);
    
    expect(screen.getByText('🧠 Ask AI')).toBeInTheDocument();
    expect(screen.getByText('🗳️ Timeline')).toBeInTheDocument();
    expect(screen.getByText('🎯 Quiz')).toBeInTheDocument();
  });

  it('highlights the active mode correctly', () => {
    render(<ModeSwitcher appMode="timeline" setAppMode={vi.fn()} />);
    
    const timelineBtn = screen.getByText('🗳️ Timeline');
    expect(timelineBtn).toHaveClass('active');
    expect(timelineBtn).toHaveAttribute('aria-pressed', 'true');
    
    const chatBtn = screen.getByText('🧠 Ask AI');
    expect(chatBtn).not.toHaveClass('active');
    expect(chatBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls setAppMode when a button is clicked', () => {
    const mockSetAppMode = vi.fn();
    render(<ModeSwitcher appMode="chat" setAppMode={mockSetAppMode} />);
    
    const quizBtn = screen.getByText('🎯 Quiz');
    fireEvent.click(quizBtn);
    
    expect(mockSetAppMode).toHaveBeenCalledWith('quiz');
    expect(mockSetAppMode).toHaveBeenCalledTimes(1);
  });
});
