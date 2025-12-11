import React, { useState, useRef, useEffect } from 'react';
import { AppSettings, LinkItem, Theme, ViewMode } from '../types';
import { THEMES, EMOJI_PRESETS } from '../constants';
import { X, Plus, Trash2, Save, Layout, LayoutGrid, Maximize, Rss, Palette, Smile, GripVertical } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Drag and drop refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Sync local state with props when they change (e.g. from server polling)
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const addLink = () => {
    if (!newLinkUrl || !newLinkTitle) return;
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: newLinkTitle,
      url: newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`,
      icon: newLinkIcon || undefined,
    };
    setLocalSettings({
      ...localSettings,
      links: [...localSettings.links, newLink],
    });
    // Reset form
    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkIcon('');
    setShowEmojiPicker(false);
  };

  const removeLink = (id: string) => {
    setLocalSettings({
      ...localSettings,
      links: localSettings.links.filter(l => l.id !== id),
    });
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    // Set effect allowed
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    e.preventDefault();
    if (dragItem.current === null) return;
    if (dragItem.current === position) return;

    const newLinks = [...localSettings.links];
    const draggedLinkContent = newLinks[dragItem.current];

    // Remove the item from its original position
    newLinks.splice(dragItem.current, 1);
    // Insert it at the new position
    newLinks.splice(position, 0, draggedLinkContent);

    // Update the ref to track the new position of the dragged item
    dragItem.current = position;
    
    setLocalSettings({ ...localSettings, links: newLinks });
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950">
          <h2 className="text-xl font-bold">Dashboard Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Appearance Section */}
          <section>
            <div className="flex items-center space-x-2 mb-4 text-cyan-400">
              <Palette className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Theme</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setLocalSettings({ ...localSettings, themeId: theme.id })}
                  className={`
                    relative h-16 rounded-lg overflow-hidden border-2 transition-all
                    ${localSettings.themeId === theme.id ? 'border-cyan-400 scale-105 shadow-lg shadow-cyan-900/50' : 'border-transparent opacity-70 hover:opacity-100'}
                  `}
                  title={theme.name}
                >
                  <div className={`absolute inset-0 ${theme.gradient}`}></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white shadow-black drop-shadow-md">
                    {theme.name.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* View Mode Section */}
          <section>
             <div className="flex items-center space-x-2 mb-4 text-cyan-400">
              <Layout className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Layout Size</h3>
            </div>
            <div className="flex bg-slate-800 p-1 rounded-lg">
              {[
                { mode: ViewMode.Compact, icon: Layout, label: 'Compact' },
                { mode: ViewMode.Regular, icon: LayoutGrid, label: 'Regular' },
                { mode: ViewMode.Large, icon: Maximize, label: 'Large' },
              ].map((view) => (
                <button
                  key={view.mode}
                  onClick={() => setLocalSettings({ ...localSettings, viewMode: view.mode })}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-all ${
                    localSettings.viewMode === view.mode ? 'bg-slate-700 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <view.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{view.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* RSS Section */}
          <section>
            <div className="flex items-center space-x-2 mb-4 text-cyan-400">
              <Rss className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">News Feed</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localSettings.showRss}
                  onChange={(e) => setLocalSettings({...localSettings, showRss: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/50"
                />
                <span className="text-slate-300">Show RSS Feed at bottom</span>
              </label>
              
              {localSettings.showRss && (
                <div>
                  <label className="block text-xs text-slate-500 mb-1">RSS Feed URL</label>
                  <input 
                    type="text" 
                    value={localSettings.rssUrl}
                    onChange={(e) => setLocalSettings({...localSettings, rssUrl: e.target.value})}
                    placeholder="https://example.com/feed.xml"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Note: Some feeds may be blocked by CORS policies.</p>
                </div>
              )}
            </div>
          </section>

          {/* Links Management */}
          <section>
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center space-x-2 text-cyan-400">
                <LayoutGrid className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Custom Links</h3>
              </div>
              <span className="text-xs text-slate-500">{localSettings.links.length} Links</span>
            </div>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              {localSettings.links.map((link, index) => (
                <div 
                  key={link.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700 cursor-move hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center mr-3 overflow-hidden">
                    <GripVertical className="w-5 h-5 text-slate-600 mr-2 group-hover:text-slate-400 transition-colors flex-shrink-0" />
                    <span className="text-lg mr-3 select-none flex-shrink-0">{link.icon || '🌐'}</span>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium text-sm truncate">{link.title}</span>
                      <span className="text-xs text-slate-500 truncate">{link.url}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeLink(link.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-2 flex-shrink-0"
                    onMouseDown={(e) => e.stopPropagation()} // Prevent drag start on button click
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {localSettings.links.length === 0 && (
                <div className="text-center py-8 text-slate-600 italic text-sm border border-dashed border-slate-800 rounded-lg">
                  No links yet. Add one below!
                </div>
              )}
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Add New Link</h4>
              <div className="flex gap-3 mb-3">
                {/* Emoji Picker Button */}
                <div className="relative">
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="h-10 w-10 flex items-center justify-center bg-slate-900 border border-slate-600 rounded-lg text-lg hover:border-cyan-500 focus:border-cyan-500 transition-colors"
                    title="Pick Icon"
                  >
                    {newLinkIcon || <Smile className="w-5 h-5 text-slate-500" />}
                  </button>
                  
                  {/* Emoji Grid Popover */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-2 p-2 bg-slate-800 border border-slate-600 rounded-xl shadow-xl w-64 z-10 grid grid-cols-6 gap-1 h-48 overflow-y-auto custom-scrollbar">
                      <button 
                         onClick={() => { setNewLinkIcon(''); setShowEmojiPicker(false); }}
                         className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-700 text-xs text-slate-400 col-span-1"
                         title="Default Favicon"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      {EMOJI_PRESETS.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => { setNewLinkIcon(emoji); setShowEmojiPicker(false); }}
                          className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-700 text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Title (e.g. Plex)" 
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none h-10"
                  />
                  <input 
                    type="text" 
                    placeholder="URL (e.g. http://192.168.1.5:32400)" 
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none h-10"
                  />
                </div>
              </div>

              {/* Add Button */}
              <button 
                onClick={addLink}
                disabled={!newLinkTitle || !newLinkUrl}
                className="w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-all font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </button>
              
              {/* Popover backdrop closer */}
              {showEmojiPicker && (
                <div className="fixed inset-0 z-0" onClick={() => setShowEmojiPicker(false)}></div>
              )}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end space-x-4">
          <button onClick={onClose} className="px-5 py-2 text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-all transform hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;