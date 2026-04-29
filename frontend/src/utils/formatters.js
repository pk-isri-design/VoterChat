export const autoLinkForms = (text) => {
  if (!text) return text;
  return text.replace(/(\[.*?\]\(.*?\))|((?:Form|फॉर्म|ফর্ম|படிவம்|ఫారం|ફોર્મ|ഫോറം)\s*[0-9]+[A-Z]?)/gi, (match, existingLink, formMatch) => {
    if (existingLink) return existingLink;
    return `[${formMatch}](https://voters.eci.gov.in/home/forms)`;
  });
};
