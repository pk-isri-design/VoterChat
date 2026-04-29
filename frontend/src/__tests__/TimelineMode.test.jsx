import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TimelineMode from '../components/TimelineMode';

describe('TimelineMode Component', () => {
  it('renders all 7 phases of the timeline', () => {
    render(<TimelineMode appLanguage="en-IN" />);
    
    // There should be 7 phases
    expect(screen.getByText('Announcement of Elections')).toBeInTheDocument();
    expect(screen.getByText('Filing of Nominations')).toBeInTheDocument();
    expect(screen.getByText('Result Declaration')).toBeInTheDocument();
    
    // All 7 phase IDs should exist inside badge elements
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('translates phase titles correctly based on appLanguage prop', () => {
    render(<TimelineMode appLanguage="hi-IN" />);
    
    // Hindi translation of Phase 1
    expect(screen.getByText('चुनावों की घोषणा')).toBeInTheDocument();
  });

  it('expands a phase when clicked', () => {
    render(<TimelineMode appLanguage="en-IN" />);
    
    // Initially hidden
    const detailsText = 'The Election Commission of India (ECI) announces the official election schedule, including dates for nominations, scrutiny, withdrawal, polling, and counting. The moment the schedule is announced, the Model Code of Conduct (MCC) comes into force automatically.';
    expect(screen.queryByText(detailsText)).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(screen.getByText('Announcement of Elections'));
    
    // Should now be visible
    expect(screen.getByText(detailsText)).toBeInTheDocument();
  });
});
