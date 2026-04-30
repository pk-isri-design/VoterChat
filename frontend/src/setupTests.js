import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock speech synthesis
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
  },
  writable: true,
});

// Mock SpeechRecognition
window.mockSpeechRecognitionInstance = {
  start: vi.fn(),
  stop: vi.fn(),
  abort: vi.fn(),
};

window.SpeechRecognition = window.webkitSpeechRecognition = vi.fn(() => window.mockSpeechRecognitionInstance);
window.SpeechSynthesisUtterance = vi.fn();
Element.prototype.scrollIntoView = vi.fn();
HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock framer-motion to prevent timeout issues with fake timers
vi.mock('framer-motion', () => {
  const actual = vi.importActual('framer-motion');
  return {
    __esModule: true,
    ...actual,
    AnimatePresence: ({ children }) => children,
    motion: {
      div: ({ children, ...props }) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...validProps } = props;
        return React.createElement('div', validProps, children);
      },
      span: ({ children, ...props }) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...validProps } = props;
        return React.createElement('span', validProps, children);
      }
    }
  };
});
