import { LinkItem, Theme, ViewMode, AppSettings } from './types';

export const ITEMS_PER_PAGE = 10;

export const THEMES: Theme[] = [
  {
    id: 'oceanic',
    name: 'Oceanic Depth',
    gradient: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    accentColor: 'bg-cyan-500',
    textColor: 'text-white'
  },
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    gradient: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600',
    accentColor: 'bg-yellow-300',
    textColor: 'text-white'
  },
  {
    id: 'forest',
    name: 'Misty Forest',
    gradient: 'bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900',
    accentColor: 'bg-emerald-400',
    textColor: 'text-emerald-50'
  },
  {
    id: 'midnight',
    name: 'Midnight City',
    gradient: 'bg-gradient-to-br from-gray-900 via-blue-900 to-black',
    accentColor: 'bg-blue-500',
    textColor: 'text-blue-50'
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    gradient: 'bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400',
    accentColor: 'bg-white',
    textColor: 'text-slate-800'
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    gradient: 'bg-gradient-to-br from-green-300 via-blue-500 to-purple-600',
    accentColor: 'bg-green-300',
    textColor: 'text-white'
  },
  {
    id: 'volcano',
    name: 'Volcano',
    gradient: 'bg-gradient-to-br from-red-800 via-orange-600 to-yellow-500',
    accentColor: 'bg-orange-300',
    textColor: 'text-white'
  },
  {
    id: 'royal',
    name: 'Royal Guard',
    gradient: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800',
    accentColor: 'bg-amber-400',
    textColor: 'text-white'
  },
  {
    id: 'slate',
    name: 'Clean Slate',
    gradient: 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400',
    accentColor: 'bg-slate-800',
    textColor: 'text-slate-900'
  },
  {
    id: 'cyber',
    name: 'Cyberpunk',
    gradient: 'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500',
    accentColor: 'bg-cyan-400',
    textColor: 'text-slate-900'
  }
];

// Empty default settings for client-side initialization.
// The actual data will come from the server.
export const DEFAULT_SETTINGS: AppSettings = {
  themeId: 'oceanic',
  viewMode: ViewMode.Regular,
  showRss: true,
  rssUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
  links: [], 
  carouselPage: 0,
};

export const STORAGE_KEY = 'glassdash_settings_v1';

export const EMOJI_PRESETS = [
  '🏠', '🏢', '🌐', '☁️', '💾', '🖥️', '📱', '📺', 
  '🎮', '🎵', '📷', '📁', '⚙️', '🔧', '🔒', '🔑', 
  '🚪', '💡', '🔌', '🔋', '📡', '🔭', '🔬', '💊', 
  '🛒', '💳', '💵', '📊', '📅', '📝', '📚', '🎓', 
  '🍕', '☕', '🍺', '🚗', '✈️', '🚀', '🧠', '🤖',
  '🎨', '🎬', '🎤', '🎧', '🎸', '🥁', '⚽', '🏀'
];