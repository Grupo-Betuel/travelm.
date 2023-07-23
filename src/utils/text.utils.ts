export const cleanText = (text: string) => text.toLowerCase().replace(/[ ]/gi, '');

export const parseToNumberFormat = (phone: string) => `+1 (${phone.substring(1, 4)}) ${phone.substring(4 - 7)}-${phone.substring(
  7,
  11,
)}`;
