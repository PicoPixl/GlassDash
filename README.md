# GlassDash

A beautiful, self-hostable start page with glassmorphic design, custom links, and RSS integration.

<img width="2158" height="1313" alt="image" src="https://github.com/user-attachments/assets/80803858-8fb0-49f7-ab79-87c8feb5f9b1" />

## Features

- 🎨 **Glassmorphic Design**: Modern UI with real-time blur effects.
- 🌈 **Themes**: 10 built-in gradient themes.
- 🔗 **Link Management**: Add, edit, and remove custom shortcuts.
- 📰 **RSS Feed**: Integrated news reader with dual-fetch strategy (CORS proxy fallback).
- 💾 **Persistence**: All data stored server-side in a JSON file.
- 🐳 **Docker Ready**: One-click deployment.

## Deployment

### Docker Compose (Recommended)

1.  Clone this repository.
2.  Run the container:
    ```bash
    docker-compose up -d
    ```
3.  Access the dashboard at `http://localhost:4422`.

### Data Persistence
The `docker-compose.yml` file maps a local `./data` folder to the container. Your links and settings will be saved in `./data/settings.json`. Back up this file to save your configuration.

## Security Warning

**IMPORTANT**: This application is designed to be hosted behind a secure network (e.g., LAN, VPN, or behind an authentication proxy like Authelia or Authentik). It does not implement its own authentication mechanism. Exposing this directly to the public internet allows anyone to modify your links and view your dashboard.

## Transparency Note

This application was designed and architected with the assistance of Artificial Intelligence (AI). While every effort has been made to ensure code quality and security, users are encouraged to review the code before deployment in sensitive environments.
