import React, { useEffect, useState } from 'react';
import { RSSItem } from '../types';
import { fetchRSS } from '../services/rssService';
import { Newspaper, Loader2, RefreshCw } from 'lucide-react';

interface RSSFeedProps {
  url: string;
  visible: boolean;
}

const RSSFeed: React.FC<RSSFeedProps> = ({ url, visible }) => {
  const [items, setItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadFeed = async () => {
    if (!url) return;
    setLoading(true);
    setError(false);
    const feed = await fetchRSS(url);
    if (feed.length > 0) {
      setItems(feed);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      loadFeed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, visible]);

  if (!visible) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-2 text-white/80">
          <Newspaper className="w-5 h-5" />
          <h2 className="text-lg font-medium tracking-wide">Latest News</h2>
        </div>
        <button 
          onClick={loadFeed} 
          className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
          title="Refresh Feed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && items.length === 0 && (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white/5 backdrop-blur-sm rounded-xl animate-pulse"></div>
          ))
        )}

        {!loading && error && (
          <div className="col-span-full text-center py-8 text-white/50 bg-white/5 rounded-xl backdrop-blur-sm">
            <p>Unable to load feed. Check URL or CORS settings.</p>
          </div>
        )}

        {items.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/5 rounded-xl transition-all hover:scale-[1.01] group"
          >
            <h3 className="text-white/90 font-medium text-sm mb-2 line-clamp-2 group-hover:text-cyan-200 transition-colors">
              {item.title}
            </h3>
            <p className="text-white/50 text-xs line-clamp-2">
              {item.description}
            </p>
            {item.pubDate && (
               <div className="mt-2 text-white/30 text-[10px] text-right">
                  {new Date(item.pubDate).toLocaleDateString()}
               </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default RSSFeed;
