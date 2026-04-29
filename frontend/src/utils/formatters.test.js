import { describe, it, expect } from 'vitest';
import { autoLinkForms } from './formatters';

describe('formatters - autoLinkForms', () => {
  it('should auto-link standard English Form strings', () => {
    const input = 'You need to fill out Form 6 to register.';
    const expected = 'You need to fill out [Form 6](https://voters.eci.gov.in/home/forms) to register.';
    expect(autoLinkForms(input)).toBe(expected);
  });

  it('should auto-link forms with letter suffixes', () => {
    const input = 'Download Form 6A and Form 8.';
    const expected = 'Download [Form 6A](https://voters.eci.gov.in/home/forms) and [Form 8](https://voters.eci.gov.in/home/forms).';
    expect(autoLinkForms(input)).toBe(expected);
  });

  it('should auto-link Hindi form strings', () => {
    const input = 'कृपया फॉर्म 8 भरें।';
    const expected = 'कृपया [फॉर्म 8](https://voters.eci.gov.in/home/forms) भरें।';
    expect(autoLinkForms(input)).toBe(expected);
  });

  it('should auto-link Bengali form strings', () => {
    const input = 'দয়া করে ফর্ম 6 পূরণ করুন।';
    const expected = 'দয়া করে [ফর্ম 6](https://voters.eci.gov.in/home/forms) পূরণ করুন।';
    expect(autoLinkForms(input)).toBe(expected);
  });

  it('should not overwrite existing markdown links', () => {
    const input = 'Here is [Form 6](http://custom-link.com).';
    expect(autoLinkForms(input)).toBe(input);
  });

  it('should handle null or undefined gracefully', () => {
    expect(autoLinkForms(null)).toBe(null);
    expect(autoLinkForms(undefined)).toBe(undefined);
    expect(autoLinkForms('')).toBe('');
  });
});
