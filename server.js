import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'settings.json');

// Server-side defaults. These are used only to seed the file the very first time.
// After that, the file is the source of truth.
const SERVER_DEFAULTS = {
  themeId: 'oceanic',
  viewMode: 'regular',
  showRss: true,
  rssUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
  links: [
    { id: '1', title: 'GitHub', url: 'https://github.com' },
    { id: '2', title: 'Reddit', url: 'https://reddit.com' },
    { id: '3', title: 'YouTube', url: 'https://youtube.com', icon: '📺' },
    { id: '4', title: 'Local Server', url: 'http://localhost:8080', icon: '🖥️' },
    { id: '5', title: 'Home Assistant', url: 'http://homeassistant.local:8123', icon: '🏠' },
  ],
  carouselPage: 0,
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)){
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Seed the settings file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    console.log('No settings file found. Creating default settings.json...');
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(SERVER_DEFAULTS, null, 2));
    } catch (err) {
        console.error('Failed to write default settings file:', err);
    }
}

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Disable ETag to prevent 304 Not Modified responses
app.disable('etag');

// API Routes
app.get('/api/settings', (req, res) => {
    // CRITICAL: Prevent browser caching so multiple devices always get the latest data
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Expires', '-1');
    res.set('Pragma', 'no-cache');

    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            res.json(JSON.parse(data));
        } else {
            // Should not happen due to seeding, but safe fallback
            res.json(SERVER_DEFAULTS); 
        }
    } catch (error) {
        console.error('Error reading settings:', error);
        res.status(500).json({ error: 'Failed to read settings' });
    }
});

app.post('/api/settings', (req, res) => {
    try {
        const settings = req.body;
        fs.writeFileSync(DATA_FILE, JSON.stringify(settings, null, 2));
        console.log('Settings saved successfully');
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// Serve static files from the React build
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Handle SPA routing - return index.html for any unknown route
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Data storage location: ${DATA_FILE}`);
});