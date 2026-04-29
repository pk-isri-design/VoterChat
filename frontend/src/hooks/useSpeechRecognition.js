import { useState, useRef, useEffect, useCallback } from 'react';

export function useSpeechRecognition(appLanguage, setInput, setSpeechTrigger) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const speechTimeoutRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setInput(finalTranscript);

        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        
        speechTimeoutRef.current = setTimeout(() => {
          recognitionRef.current?.stop();
          setIsListening(false);
          setSpeechTrigger(finalTranscript);
        }, 3000);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, [setInput, setSpeechTrigger]); // These are stable from useState, so it's safe

  const toggleListening = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        recognitionRef.current.lang = appLanguage;
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Your browser does not support Speech Recognition.");
      }
    }
  }, [isListening, appLanguage]);

  return {
    isListening,
    toggleListening,
    setIsListening
  };
}
