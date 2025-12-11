import React from 'react';
import { LinkItem, ViewMode } from '../types';
import { ExternalLink, Globe } from 'lucide-react';

interface LinkCardProps {
  link: LinkItem;
  viewMode: ViewMode;
  onEdit?: (link: LinkItem) => void;
  editMode: boolean;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, viewMode, onEdit, editMode }) => {
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return '';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (editMode) {
      e.preventDefault();
      onEdit?.(link);
    }
  };

  // Dynamic classes based on ViewMode
  const containerClasses = {
    [ViewMode.Compact]: "h-16 flex-row items-center px-4 space-x-4",
    [ViewMode.Regular]: "h-32 flex-col justify-center items-center space-y-3 p-4",
    [ViewMode.Large]: "h-48 flex-col justify-center items-center space-y-4 p-6",
  };

  const iconSize = {
    [ViewMode.Compact]: "w-8 h-8",
    [ViewMode.Regular]: "w-12 h-12",
    [ViewMode.Large]: "w-20 h-20",
  };
  
  const emojiSize = {
    [ViewMode.Compact]: "text-xl",
    [ViewMode.Regular]: "text-3xl",
    [ViewMode.Large]: "text-5xl",
  };

  const textSize = {
    [ViewMode.Compact]: "text-sm font-medium",
    [ViewMode.Regular]: "text-base font-semibold text-center",
    [ViewMode.Large]: "text-xl font-bold text-center",
  };

  // Determine if we should show a custom emoji or fetch the favicon
  const hasCustomEmoji = link.icon && !link.icon.startsWith('http');

  return (
    <a
      href={editMode ? "#" : link.url}
      target={editMode ? "_self" : "_blank"}
      rel="noopener noreferrer"
      onClick={handleCardClick}
      className={`
        relative group
        flex ${containerClasses[viewMode]}
        bg-white/10 hover:bg-white/20 
        backdrop-blur-md border border-white/10
        rounded-2xl shadow-lg transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl
        cursor-pointer overflow-hidden
        ${editMode ? 'animate-pulse ring-2 ring-yellow-400/50' : ''}
      `}
    >
      <div className={`relative ${iconSize[viewMode]} flex-shrink-0 bg-white/10 rounded-full flex items-center justify-center shadow-inner`}>
        {hasCustomEmoji ? (
          <span className={`${emojiSize[viewMode]} select-none flex items-center justify-center w-full h-full pb-1`}>
            {link.icon}
          </span>
        ) : (
          <>
            <img
              src={getFaviconUrl(link.url)}
              alt={link.title}
              className="w-full h-full object-cover rounded-full opacity-90 group-hover:opacity-100 transition-opacity p-1.5"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden absolute inset-0 flex items-center justify-center text-white/50">
                <Globe className="w-1/2 h-1/2" />
            </div>
          </>
        )}
      </div>
      
      <div className={`${textSize[viewMode]} text-white/90 truncate w-full group-hover:text-white transition-colors`}>
        {link.title}
      </div>

      {editMode && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
          EDIT
        </div>
      )}
      
      {!editMode && (
         <ExternalLink className="absolute top-3 right-3 w-3 h-3 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </a>
  );
};

export default LinkCard;