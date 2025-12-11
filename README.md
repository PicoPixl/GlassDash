# GlassDash

A beautiful, self-hostable start page with glassmorphic design, custom links, and RSS integration.

<img width="2158" height="1313" alt="image" src="https://github.com/user-attachments/assets/80803858-8fb0-49f7-ab79-87c8feb5f9b1" />

## Features

- 🎨 **Glassmorphic Design**: Modern UI with real-time blur effects.
- 🌈 **Themes**: 10 built-in gradient themes.
- 🔗 **Link Management**: Add, edit, and remove custom shortcuts.
- ☁️ **Server-Side Sync**: Links and settings are stored centralized on the server. Access your dashboard from any device (Desktop, Mobile, Tablet) and see the same links.
- 📰 **RSS Feed**: Integrated news reader with dual-fetch strategy (CORS proxy fallback).
- 🐳 **Docker Ready**: One-click deployment with a lightweight Node.js server.

## Deployment

### Docker Compose (Recommended)

1.  Clone this repository.
2.  Run the container:
    ```bash
    docker-compose up -d --build
    ```
3.  Access the dashboard at `http://localhost:4422`.

### Data Persistence
The application uses a **Server-Authoritative** model. The `docker-compose.yml` file maps a local `./data` folder to the container. 
*   Your links and settings are saved in `./data/settings.json`.
*   **Back up this file** to save your configuration.
*   If you delete this file, the server will recreate it with default links on the next restart.

## Security Warning

**IMPORTANT**: This application is designed to be hosted behind a secure network (e.g., LAN, VPN, or behind an authentication proxy like Authelia or Authentik). It does not implement its own authentication mechanism. Exposing this directly to the public internet allows anyone to modify your links and view your dashboard.

## Transparency Note

This application was designed and architected with the assistance of Artificial Intelligence (AI). While every effort has been made to ensure code quality and security, users are encouraged to review the code before deployment in sensitive environments.

## License

MIT License
