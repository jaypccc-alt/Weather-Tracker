# 🌪️ Weather-Tracker & Environmental Intelligence Hub

A professional-grade, real-time weather monitoring station and global natural event tracker. This application provides a unified dashboard for tracking local weather conditions, monitoring global storm movements, and reviewing live environmental alerts from NASA.

## 🌟 Key Features

### 🚀 Operations Dashboard (Home)
- **Live Local Station**: Automatic geolocation and real-time local weather updates.
- **NASA Intel Feed**: Live stream of global natural events including wildfires, severe storms, and flooding.
- **Auto-Sync**: Data refreshes automatically every 10 minutes to keep you ahead of changing conditions.

### 🛰️ Mission Control (Storm Tracker)
- **Global Pursuit Focus**: Advanced tracking for Tropical Cyclones and Typhoons using the GDACS database.
- **Pursuit Mode**: The map automatically "locks on" and follows the most severe active storms.
- **Live Radar**: Real-time precipitation overlays via the RainViewer API.
- **Emoji Markers**: High-visibility markers (🌪️, 🌀, ⛈️) for intuitive event classification.

### 🌡️ Weather Hub (Search Center)
- **Global Search**: Lightweight, map-free search for current conditions in any city or town worldwide.
- **Official Reports**: Premium data visualization for temperature, humidity, and atmospheric conditions.

## 🛠️ Technology Stack

- **Core**: React 19, TypeScript
- **Mapping**: Leaflet, React Leaflet (using CartoDB Voyager English labels)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 📡 Data & Intelligence Sources

- **OpenWeatherMap API**: Real-time weather and temperature data.
- **NASA EONET API**: Global natural event tracker feed.
- **GDACS API**: Global Disaster Alert and Coordination System for storm data.
- **RainViewer API**: Real-time precipitation radar tiles.
- **Nominatim (OpenStreetMap)**: Geocoding and location targeting.
