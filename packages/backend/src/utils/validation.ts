// Email validation
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Password validation - strong requirements
export const validatePassword = (password: string): boolean => {
  // At least 12 characters, uppercase, lowercase, number, special character
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  return regex.test(password);
};

// CPF validation (Brazilian format)
export const validateCPF = (cpf: string): boolean => {
  const cleanCpf = cpf.replace(/\D/g, '');
  
  if (cleanCpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;

  return true;
};

// Phone number validation (Brazil)
export const validatePhoneNumber = (phone: string): boolean => {
  const regex = /^\(?([0-9]{2})\)?([9])?([0-9]{4})-?([0-9]{4})$/;
  return regex.test(phone);
};

// Username validation
export const validateUsername = (username: string): boolean => {
  const regex = /^[a-zA-Z0-9_]{3,30}$/;
  return regex.test(username);
};

// URL validation
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// File size validation (in bytes)
export const validateFileSize = (sizeBytes: number, maxSizeMB: number): boolean => {
  return sizeBytes <= maxSizeMB * 1024 * 1024;
};

// Allowed MIME types for content
export const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/quicktime']
};

export const validateMimeType = (mimeType: string, type: 'image' | 'video'): boolean => {
  return ALLOWED_MIME_TYPES[type].includes(mimeType);
};

// Price validation
export const validatePrice = (price: number): boolean => {
  return price > 0 && price <= 1000; // Max R$1000 per item
};
