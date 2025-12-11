import { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

// Fetch settings from the server API
export const loadSettings = async (): Promise<AppSettings | null> => {
  try {
    // Add timestamp to query to bust browser/network cache
    const response = await fetch(`/api/settings?_t=${Date.now()}`, {
      headers: { 
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      // If the server returns valid JSON (even empty object), merge it with structure
      // to ensure all fields exist.
      return { ...DEFAULT_SETTINGS, ...data };
    }
  } catch (e) {
    console.error('Failed to load settings from server', e);
  }
  // Return null to indicate we failed to get authoritative data.
  // Do NOT return local defaults here, or the user will see fake data.
  return null;
};

// Save settings to the server API
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
  } catch (e) {
    console.error('Failed to save settings to server', e);
  }
};