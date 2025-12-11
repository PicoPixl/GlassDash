import React, { useState, useEffect } from 'react';
import { Settings, Plus, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { THEMES, DEFAULT_SETTINGS, ITEMS_PER_PAGE } from './constants';
import { AppSettings } from './types';
import { loadSettings, saveSettings } from './services/storageService';
import LinkCard from './components/LinkCard';
import RSSFeed from './components/RSSFeed';
import SettingsModal from './components/SettingsModal';

function App() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load settings on mount
  useEffect(() => {
    const initSettings = async () => {
      setLoading(true);
      const loaded = await loadSettings();
      if (loaded) {
        setSettings(loaded);
        setError(false);
      } else {
        setError(true);
      }
      setLoading(false);
    };
    initSettings();
  }, []);

  // Clock Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Polling mechanism to keep multiple devices in sync
  useEffect(() => {
    if (!settings || error) return;

    const checkForUpdates = async () => {
      // Don't poll if user is actively editing settings to avoid conflict/overwriting
      if (isSettingsOpen) return;

      try {
        const latestSettings = await loadSettings();
        if (latestSettings) {
          // Simple deep compare to avoid unnecessary re-renders
          if (JSON.stringify(latestSettings) !== JSON.stringify(settings)) {
            console.log('Remote changes detected, updating UI...');
            setSettings(latestSettings);
          }
        }
      } catch (e) {
        console.error("Polling failed", e);
      }
    };

    const intervalId = setInterval(checkForUpdates, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId);
  }, [settings, isSettingsOpen, error]);

  const handleSaveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings); // Optimistic UI update
    await saveSettings(newSettings); // Background save
  };

  const handleOpenSettings = async () => {
    // Force a fresh fetch before opening settings to ensure we don't overwrite with stale data
    try {
      const latest = await loadSettings();
      if (latest) {
        setSettings(latest);
      }
      setIsSettingsOpen(true);
    } catch (e) {
      console.error("Failed to refresh settings before open", e);
      // If fetch fails, we still allow opening settings if we have old data, 
      // but ideally we'd warn the user. For now, just open.
      if (settings) setIsSettingsOpen(true);
    }
  };

  // Safe accessor since settings can be null during load
  const currentSettings = settings || DEFAULT_SETTINGS;
  const currentTheme = THEMES.find(t => t.id === currentSettings.themeId) || THEMES[0];

  // Carousel Logic
  // The 'Add Button' counts as a virtual item
  const totalItems = currentSettings.links.length + 1; 
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  // Ensure current page is valid (e.g. if links were deleted)
  useEffect(() => {
    if (settings) {
      if (settings.carouselPage >= totalPages && totalPages > 0) {
        handleSaveSettings({ ...settings, carouselPage: totalPages - 1 });
      } else if (settings.carouselPage < 0) {
        handleSaveSettings({ ...settings, carouselPage: 0 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, totalPages, loading]);

  const goToPage = (pageIndex: number) => {
    if (!settings) return;
    if (pageIndex >= 0 && pageIndex < totalPages) {
      handleSaveSettings({ ...settings, carouselPage: pageIndex });
    }
  };

  
  // Slice items for current page
  const startIndex = currentSettings.carouselPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLinks = currentSettings.links.slice(startIndex, endIndex);
  
  // Determine if Add Button should be shown on this page
  // The Add Button is effectively at index `settings.links.length`
  const showAddButton = currentSettings.links.length >= startIndex && currentSettings.links.length < endIndex;

  // Loading / Error States
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Connection Error</h1>
        <p className="text-white/60 text-center max-w-md mb-6">
          Could not load your dashboard settings. Please ensure the server is running and accessible.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg transition-colors font-medium"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full transition-colors duration-700 ease-in-out ${currentTheme.gradient} ${currentTheme.textColor} flex flex-col`}>
      
      {/* Background Overlay for Texture/Noise if desired, currently just gradient */}
      <div className="fixed inset-0 bg-noise opacity-5 pointer-events-none"></div>

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16 flex flex-col items-center relative z-10">
        
        {/* Header / Clock Area */}
        <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-6xl font-thin tracking-tight mb-2 drop-shadow-md">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h1>
            <p className="text-lg opacity-80 font-light tracking-widest uppercase">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
        </div>

        {/* Carousel Container */}
        <div className="w-full max-w-7xl flex items-center justify-center space-x-2 md:space-x-4">
          
          {/* Previous Button */}
          <button 
            onClick={() => goToPage(currentSettings.carouselPage - 1)}
            disabled={currentSettings.carouselPage === 0}
            className={`
              p-2 md:p-3 rounded-full bg-white/5 hover:bg-white/20 transition-all backdrop-blur-sm
              ${currentSettings.carouselPage === 0 ? 'opacity-0 cursor-default' : 'opacity-100 cursor-pointer'}
            `}
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white/80" />
          </button>

          <div className="flex-1 flex flex-col items-center">
            {/* Dashboard Grid */}
            <div className={`
              w-full grid gap-4 md:gap-6
              ${currentSettings.viewMode === 'compact' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 
                currentSettings.viewMode === 'regular' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 
                'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}
            `}>
              {currentLinks.map((link) => (
                <LinkCard 
                  key={link.id} 
                  link={link} 
                  viewMode={currentSettings.viewMode} 
                  editMode={false}
                />
              ))}

              {/* Add Button (Visual Cue) - Only renders if on the correct page */}
              {showAddButton && (
                <button
                  onClick={handleOpenSettings}
                  className={`
                    group flex flex-col items-center justify-center
                    border-2 border-dashed border-white/20 hover:border-white/50
                    bg-white/5 hover:bg-white/10 rounded-2xl transition-all
                    ${currentSettings.viewMode === 'compact' ? 'h-16' : currentSettings.viewMode === 'regular' ? 'h-32' : 'h-48'}
                  `}
                >
                  <Plus className="w-8 h-8 text-white/30 group-hover:text-white/80 transition-colors" />
                  {currentSettings.viewMode !== 'compact' && (
                    <span className="mt-2 text-sm text-white/30 group-hover:text-white/80 font-medium">Add Link</span>
                  )}
                </button>
              )}
            </div>

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="flex space-x-2 mt-6">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToPage(idx)}
                    className={`
                      w-2.5 h-2.5 rounded-full transition-all duration-300 
                      ${currentSettings.carouselPage === idx ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}
                    `}
                    aria-label={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Next Button */}
          <button 
            onClick={() => goToPage(currentSettings.carouselPage + 1)}
            disabled={currentSettings.carouselPage === totalPages - 1}
            className={`
              p-2 md:p-3 rounded-full bg-white/5 hover:bg-white/20 transition-all backdrop-blur-sm
              ${currentSettings.carouselPage === totalPages - 1 ? 'opacity-0 cursor-default' : 'opacity-100 cursor-pointer'}
            `}
            aria-label="Next Page"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white/80" />
          </button>
        </div>

        {/* RSS Feed Area */}
        <RSSFeed url={currentSettings.rssUrl} visible={currentSettings.showRss} />

      </main>

      {/* Floating Settings Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleOpenSettings}
          className="p-3 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white rounded-full shadow-lg backdrop-blur-md transition-all hover:rotate-90"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={currentSettings}
        onSave={handleSaveSettings}
      />
      
      {/* Footer info */}
      <footer className="w-full text-center py-4 text-white/20 text-xs">
        <p>GlassDash • Self-Hosted</p>
      </footer>
    </div>
  );
}

export default App;