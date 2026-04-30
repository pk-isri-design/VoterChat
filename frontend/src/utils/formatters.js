/**
 * Automatically converts unlinked Election Commission form references into Markdown links.
 * Ignores already linked forms to prevent nested Markdown.
 * Supports multilingual form words (English, Hindi, Bengali, Tamil, Telugu, Gujarati, Malayalam).
 *
 * @param {string} text - The raw text content from the AI or system.
 * @returns {string} The text with all raw form names replaced with Markdown links.
 */
export const autoLinkForms = (text) => {
  if (!text) return text;
  return text.replace(/(\[.*?\]\(.*?\))|((?:Form|फॉर्म|ফর্ম|படிவம்|ఫారం|ફોર્મ|ഫോറം)\s*[0-9]+[A-Z]?)/gi, (match, existingLink, formMatch) => {
    if (existingLink) return existingLink;
    return `[${formMatch}](https://voters.eci.gov.in/home/forms)`;
  });
};
