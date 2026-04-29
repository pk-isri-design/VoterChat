import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QuickTabs from '../components/QuickTabs';
import { translations } from '../utils/translations';

describe('QuickTabs Component', () => {
  it('renders all static tabs based on the selected language', () => {
    render(<QuickTabs appLanguage="en-IN" handleStaticTabClick={vi.fn()} />);
    
    // We expect "Download Forms", "Register as Voter", etc.
    const tabs = translations['en-IN'].tabs;
    tabs.forEach(tab => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it('calls handleStaticTabClick with correct data when a tab is clicked', () => {
    const mockClick = vi.fn();
    render(<QuickTabs appLanguage="en-IN" handleStaticTabClick={mockClick} />);
    
    const firstTab = translations['en-IN'].tabs[0];
    const button = screen.getByText(firstTab.label);
    
    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledWith(firstTab);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
