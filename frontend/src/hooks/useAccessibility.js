import { useState, useEffect } from 'react';

export function useAccessibility() {
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  // Apply zoom to the entire page by changing the CSS root font-size.
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizeMultiplier * 100}%`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontSizeMultiplier]);

  const handleIncreaseText = () => setFontSizeMultiplier(prev => Math.min(prev + 0.1, 1.5));
  const handleDecreaseText = () => setFontSizeMultiplier(prev => Math.max(prev - 0.1, 0.8));

  return {
    highContrast,
    setHighContrast,
    handleIncreaseText,
    handleDecreaseText
  };
}
