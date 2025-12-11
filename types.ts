export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string; // Optional custom icon, defaults to favicon
}

export enum ViewMode {
  Compact = 'compact',
  Regular = 'regular',
  Large = 'large',
}

export interface AppSettings {
  themeId: string;
  viewMode: ViewMode;
  showRss: boolean;
  rssUrl: string;
  links: LinkItem[];
  carouselPage: number;
}

export interface Theme {
  id: string;
  name: string;
  gradient: string;
  accentColor: string;
  textColor: string;
}

export interface RSSItem {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
}