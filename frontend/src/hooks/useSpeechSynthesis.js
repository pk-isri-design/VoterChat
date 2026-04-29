import { useState, useRef, useEffect, useCallback } from 'react';

export function useSpeechSynthesis(appLanguage) {
  const [availableVoices, setAvailableVoices] = useState([]);
  const [playingIndex, setPlayingIndex] = useState(null);
  const speechChunksRef = useRef([]);

  useEffect(() => {
    const loadVoices = () => {
      if (window.speechSynthesis) {
        setAvailableVoices(window.speechSynthesis.getVoices());
      }
    };
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const playNextChunk = useCallback(() => {
    if (speechChunksRef.current.length === 0) {
      setPlayingIndex(null);
      return;
    }
    
    const chunk = speechChunksRef.current.shift();
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.lang = appLanguage;
    
    let voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    if (voices.length === 0) voices = availableVoices;
    const langPrefix = appLanguage.split('-')[0];
    const voice = voices.find(v => v.lang === appLanguage) || 
                  voices.find(v => v.lang.startsWith(langPrefix)) ||
                  voices.find(v => v.name.toLowerCase().includes(langPrefix));
                  
    if (voice) utterance.voice = voice;
    
    utterance.onend = () => {
      playNextChunk();
    };
    
    utterance.onerror = (e) => {
      console.error("Speech chunk error", e);
      if (e.error !== 'interrupted') {
        setPlayingIndex(null);
        speechChunksRef.current = [];
      }
    };
    
    if (window.speechSynthesis) {
      window.speechSynthesis._utterance = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [appLanguage, availableVoices]);

  const playMessage = useCallback((text, index) => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speechChunksRef.current = [];
    
    if (playingIndex === index) {
      setPlayingIndex(null);
      return;
    }

    setPlayingIndex(index);
    const cleanText = text.replace(/[*#]/g, '');
    const chunks = cleanText.match(/[^.!?।\n]+[.!?।\n]*/g) || [cleanText];
    
    speechChunksRef.current = chunks.map(c => c.trim()).filter(c => c.length > 0);
    playNextChunk();
  }, [playingIndex, playNextChunk]);

  const cancelSpeech = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speechChunksRef.current = [];
    setPlayingIndex(null);
  }, []);

  return {
    playingIndex,
    playMessage,
    cancelSpeech
  };
}
