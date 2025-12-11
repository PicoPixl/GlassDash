import { RSSItem } from '../types';

const RSS2JSON_ENDPOINT = 'https://api.rss2json.com/v1/api.json?rss_url=';
const ALLORIGINS_ENDPOINT = 'https://api.allorigins.win/get?url=';

export const fetchRSS = async (url: string): Promise<RSSItem[]> => {
  if (!url) return [];

  // Helper to strip HTML tags from descriptions
  const stripHtml = (html: string) => {
    try {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    } catch (e) {
      return html;
    }
  };

  // Strategy 1: RSS2JSON
  // Good because it returns JSON and handles encoding issues well
  const tryRss2Json = async (): Promise<RSSItem[] | null> => {
    try {
      const response = await fetch(`${RSS2JSON_ENDPOINT}${encodeURIComponent(url)}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.status !== 'ok') return null;

      return data.items.slice(0, 6).map((item: any) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: stripHtml(item.description || '').substring(0, 150) + (item.description?.length > 150 ? '...' : ''),
      }));
    } catch (e) {
      console.warn('RSS2JSON fetch failed:', e);
      return null;
    }
  };

  // Strategy 2: AllOrigins
  // Good fallback, returns raw content wrapped in JSON
  const tryAllOrigins = async (): Promise<RSSItem[] | null> => {
    try {
      const response = await fetch(`${ALLORIGINS_ENDPOINT}${encodeURIComponent(url)}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      if (!data.contents) return null;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      const items = Array.from(xmlDoc.querySelectorAll("item"));

      if (items.length === 0) return null;

      return items.slice(0, 6).map((item) => {
        const title = item.querySelector("title")?.textContent || "No Title";
        const link = item.querySelector("link")?.textContent || "#";
        const pubDate = item.querySelector("pubDate")?.textContent;
        const rawDesc = item.querySelector("description")?.textContent || "";
        const description = stripHtml(rawDesc).substring(0, 150) + (rawDesc.length > 150 ? '...' : '');

        return {
          title,
          link,
          pubDate,
          description,
        };
      });
    } catch (e) {
      console.warn('AllOrigins fetch failed:', e);
      return null;
    }
  };

  // Execute strategies
  let items = await tryRss2Json();
  
  if (!items) {
    console.log('Primary RSS fetch failed, attempting fallback proxy...');
    items = await tryAllOrigins();
  }

  if (!items) {
     console.error('All RSS fetch methods failed. Check URL or network restrictions.');
     return [];
  }

  return items;
};