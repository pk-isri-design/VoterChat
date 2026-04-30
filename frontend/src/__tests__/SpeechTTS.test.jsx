import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

describe('useSpeechSynthesis Hook', () => {
  let mockSpeak, mockCancel, mockGetVoices;

  beforeEach(() => {
    mockSpeak = vi.fn();
    mockCancel = vi.fn();
    mockGetVoices = vi.fn(() => [
      { lang: 'hi-IN', name: 'Google हिन्दी' },
      { lang: 'en-US', name: 'Google US English' },
    ]);

    window.speechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
      resume: vi.fn(),
      getVoices: mockGetVoices,
      onvoiceschanged: null,
    };

    window.SpeechSynthesisUtterance = class MockUtterance {
      constructor(text) {
        this.text = text;
        this.lang = '';
        this.voice = null;
        this.onend = null;
        this.onerror = null;
      }
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with playingIndex as null', () => {
    const { result } = renderHook(() => useSpeechSynthesis('en-IN'));
    expect(result.current.playingIndex).toBeNull();
  });

  it('should call speechSynthesis.speak when playMessage is called', () => {
    const { result } = renderHook(() => useSpeechSynthesis('en-IN'));

    act(() => {
      result.current.playMessage('Hello world.', 0);
    });

    expect(mockSpeak).toHaveBeenCalled();
    expect(result.current.playingIndex).toBe(0);
  });

  it('should toggle off speech when same index is played again', () => {
    const { result } = renderHook(() => useSpeechSynthesis('en-IN'));

    act(() => {
      result.current.playMessage('Hello world.', 0);
    });
    expect(result.current.playingIndex).toBe(0);

    act(() => {
      result.current.playMessage('Hello world.', 0);
    });
    expect(result.current.playingIndex).toBeNull();
    expect(mockCancel).toHaveBeenCalled();
  });

  it('should select the correct voice for the given language', () => {
    const { result } = renderHook(() => useSpeechSynthesis('hi-IN'));

    act(() => {
      result.current.playMessage('नमस्ते', 0);
    });

    const utteranceArg = mockSpeak.mock.calls[0][0];
    expect(utteranceArg.lang).toBe('hi-IN');
  });

  it('should cancel speech on cancelSpeech call and reset playingIndex', () => {
    const { result } = renderHook(() => useSpeechSynthesis('en-IN'));

    act(() => {
      result.current.playMessage('Some text.', 2);
    });
    expect(result.current.playingIndex).toBe(2);

    act(() => {
      result.current.cancelSpeech();
    });
    expect(mockCancel).toHaveBeenCalled();
    expect(result.current.playingIndex).toBeNull();
  });

  it('should strip markdown symbols from text before speaking', () => {
    const { result } = renderHook(() => useSpeechSynthesis('en-IN'));

    act(() => {
      result.current.playMessage('**Bold** and #Heading text.', 0);
    });

    const utteranceArg = mockSpeak.mock.calls[0][0];
    expect(utteranceArg.text).not.toContain('*');
    expect(utteranceArg.text).not.toContain('#');
  });

  it('should gracefully do nothing if speechSynthesis is unavailable', () => {
    // Override speechSynthesis to null (can't delete because it's defined via Object.defineProperty in setupTests)
    window.speechSynthesis = null;
    const { result } = renderHook(() => useSpeechSynthesis('en-IN'));

    expect(() => {
      act(() => {
        result.current.playMessage('Hello.', 0);
      });
    }).not.toThrow();
  });
});
