import '@testing-library/jest-dom';
import { vi } from 'vitest';

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
