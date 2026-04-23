import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import ChatInterface from '../components/ChatInterface';

vi.mock('axios');

describe('Speech TTS Feature', () => {
  const mockUser = { email: 'test@example.com', displayName: 'Test User' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('triggers speech synthesis with correct language after voice command', async () => {
    // Mock axios to return a response
    axios.post.mockResolvedValue({ data: { text: 'Hello from AI' } });
    
    // Mock window.speechSynthesis
    const mockSpeak = vi.fn();
    const mockCancel = vi.fn();
    const mockGetVoices = vi.fn(() => [
      { lang: 'hi-IN', name: 'Google हिन्दी' },
      { lang: 'en-US', name: 'Google US English' }
    ]);
    
    window.speechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
      getVoices: mockGetVoices,
      onvoiceschanged: null,
    };

    render(<ChatInterface user={mockUser} />);
    
    // Change language to Hindi
    const languageSelect = screen.getByTitle('Change App Language');
    fireEvent.change(languageSelect, { target: { value: 'hi-IN' } });

    // Click mic button
    const micButton = screen.getByTitle('Start speaking');
    fireEvent.click(micButton);

    // Get the recognition instance that was created
    const recognitionInstance = window.mockSpeechRecognitionInstance;
    expect(recognitionInstance).toBeDefined();

    // Simulate speech recognition result
    recognitionInstance.onresult({
      results: [
        [{ transcript: 'नमस्ते' }]
      ]
    });

    // Advance timers by 3000ms to trigger the pause detection
    vi.advanceTimersByTime(3000);

    // Wait for async operations (axios.post and speech synthesis)
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    await waitFor(() => {
      // Check if speak was called
      expect(mockSpeak).toHaveBeenCalled();
    });

    // Verify the utterance properties
    const utterance = mockSpeak.mock.calls.find(call => call[0].text === 'Hello from AI')?.[0];
    expect(utterance).toBeDefined();
    expect(utterance.lang).toBe('hi-IN');
    expect(utterance.voice).toBeDefined();
    expect(utterance.voice.lang).toBe('hi-IN');
  });
});
