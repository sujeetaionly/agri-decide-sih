import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Trigger physical haptic feedback micro-vibration on Android/mobile devices.
 */
export function triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' = 'light') {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      if (type === 'light') {
        navigator.vibrate(12);
      } else if (type === 'medium') {
        navigator.vibrate(25);
      } else if (type === 'success') {
        navigator.vibrate([15, 50, 20]);
      } else if (type === 'warning') {
        navigator.vibrate([30, 40, 30]);
      }
    } catch {
      // Ignore if blocked by browser policy
    }
  }
}

/**
 * Formats Indian Currency cleanly (e.g. ₹24,500).
 */
export function formatCurrencyINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/**
 * Formats date strings into friendly Indic format (e.g. "18 अगस्त 2026").
 */
export function formatIndicDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const cleanStr = dateStr.includes(' ') ? dateStr.replace(' ', 'T') : dateStr;
    const d = new Date(cleanStr);
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const monthsHi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
      const month = monthsHi[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    }
  } catch {
    // Return original if parsing fails
  }
  return dateStr;
}

/**
 * Formats date & time up to the minute (e.g. "18 अगस्त, 09:06 PM").
 */
export function formatIndicDateTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const cleanStr = dateStr.includes(' ') ? dateStr.replace(' ', 'T') : dateStr;
    const d = new Date(cleanStr);
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const monthsHi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
      const month = monthsHi[d.getMonth()];
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = hours.toString().padStart(2, '0');
      return `${day} ${month}, ${formattedHours}:${minutes} ${ampm}`;
    }
  } catch {
    // Return original if parsing fails
  }
  return dateStr;
}
