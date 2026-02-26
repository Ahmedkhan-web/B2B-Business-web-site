// Phone validation rules per country code
const phoneRules: Record<string, { startsWith?: string; length: number; label: string }> = {
  PK: { startsWith: '3', length: 10, label: '+92 3XX XXXXXXX (10 digits starting with 3)' },
  IN: { length: 10, label: '10 digits' },
  US: { length: 10, label: '10 digits' },
  GB: { length: 10, label: '10 digits' },
  AE: { length: 9, label: '9 digits' },
  SA: { length: 9, label: '9 digits' },
  CN: { length: 11, label: '11 digits' },
  BD: { length: 10, label: '10 digits' },
  JP: { length: 10, label: '10 digits' },
  KR: { length: 10, label: '10 digits' },
  DE: { length: 11, label: '11 digits' },
  FR: { length: 9, label: '9 digits' },
  BR: { length: 11, label: '11 digits' },
  AU: { length: 9, label: '9 digits' },
  CA: { length: 10, label: '10 digits' },
  TR: { length: 10, label: '10 digits' },
  EG: { length: 10, label: '10 digits' },
  NG: { length: 10, label: '10 digits' },
  ZA: { length: 9, label: '9 digits' },
  MY: { length: 10, label: '10 digits' },
  ID: { length: 11, label: '11 digits' },
  PH: { length: 10, label: '10 digits' },
  TH: { length: 9, label: '9 digits' },
  VN: { length: 9, label: '9 digits' },
  RU: { length: 10, label: '10 digits' },
  IT: { length: 10, label: '10 digits' },
  ES: { length: 9, label: '9 digits' },
};

// Default rule for unlisted countries
const defaultRule: { startsWith?: string; length: number; label: string } = { length: 10, label: '10 digits' };

export function getPhoneRule(countryCode: string) {
  return phoneRules[countryCode] || defaultRule;
}

export function validatePhone(phone: string, countryCode: string): { valid: boolean; message: string } {
  const digitsOnly = phone.replace(/\D/g, '');
  const rule = getPhoneRule(countryCode);

  if (!digitsOnly) return { valid: false, message: 'Phone number is required' };
  if (digitsOnly !== phone) return { valid: false, message: 'Only numbers allowed' };
  
  if (rule.startsWith && !digitsOnly.startsWith(rule.startsWith)) {
    return { valid: false, message: `Must start with ${rule.startsWith} (e.g., ${rule.label})` };
  }
  
  if (digitsOnly.length !== rule.length) {
    return { valid: false, message: `Must be exactly ${rule.length} digits (${rule.label})` };
  }

  return { valid: true, message: '' };
}

export function validateEmail(email: string): { valid: boolean; message: string } {
  if (!email) return { valid: false, message: 'Email is required' };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return { valid: false, message: 'Please enter a valid email address' };
  return { valid: true, message: '' };
}
