import { useState, useEffect } from "react";
import { Cloud, MapPin, RefreshCw, Flame, Wind, Waves, Bell } from "lucide-react";
import { getWeather } from "../../services/weatherService";
import { getNaturalEvents } from "../../services/newsService";
import type { NaturalEvent } from "../../services/newsService";

export const Home = () => {
    const [weather, setWeather] = useState<any>(null);
    const [events, setEvents] = useState<NaturalEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<string>("");

    const fetchData = async () => {
        // 1. Fetch Local Weather
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const weatherData = await getWeather(position.coords.latitude, position.coords.longitude);
                    setWeather(weatherData);
                    setLastUpdate(new Date().toLocaleTimeString());
                } catch (err) {
                    console.error("Local Weather Fetch Error:", err);
                }
            });
        }

        // 2. Fetch NASA Intel
        try {
            const newsData = await getNaturalEvents();
            setEvents(newsData.slice(0, 6)); // We show top 6 on dashboard
        } catch (err) {
            console.error("NASA News Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Refresh everything every 10 minutes
        const interval = setInterval(fetchData, 600000);
        return () => clearInterval(interval);
    }, []);

    const getCategoryIcon = (category: string) => {
        if (category.includes("Fire")) return <Flame color="#f43f5e" size={20} />;
        if (category.includes("Storm")) return <Wind color="#38bdf8" size={20} />;
        if (category.includes("Flood") || category.includes("Water")) return <Waves color="#3b82f6" size={20} />;
        return <Bell color="#eab308" size={20} />;
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}>
            
            {/* 🚀 DASHBOARD HEADER */}
            <header style={{ marginBottom: "3rem" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", background: "linear-gradient(to right, #4f46e5, #0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.5rem" }}>
                    Operations Dashboard
                </h1>
                <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Local weather and global environmental intelligence.</p>
            </header>

            {/* 🏠 TOP ROW: WEATHER WIDGET */}
            <div style={{ marginBottom: "3rem" }}>
                <div className="glass-effect" style={{ 
                    padding: "1.5rem", borderRadius: "1.5rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(255,255,255,0.4)", position: "relative", maxWidth: "450px"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ color: "#6366f1", fontWeight: "bold", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Local Station
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#94a3b8", fontSize: "0.7rem" }}>
                            <RefreshCw size={12} className={loading && !weather ? "animate-spin" : ""} /> {loading && !weather ? "Updating..." : `Live: ${lastUpdate}`}
                        </div>
                    </div>

                    {weather ? (
                        <div style={{ marginTop: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
                                <MapPin size={16} color="#6366f1" />
                                <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1e293b" }}>{weather.city}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#1e293b" }}>{weather.temp}°</div>
                                <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} style={{ width: "60px" }} alt="weather icon" />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "0.9rem" }}>
                                <Cloud size={14} /> <span>{weather.description}</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
                            {loading ? "Geolocating..." : "Location access required."}
                        </div>
                    )}
                </div>
            </div>

            {/* 🗞️ BOTTOM ROW: LIVE NASA INTEL */}
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b" }}>Environmental Intelligence</h2>
                    <span style={{ fontSize: "0.8rem", color: "#6366f1", fontWeight: "bold", background: "#f5f3ff", padding: "4px 12px", borderRadius: "50px" }}>NASA LIVE FEED</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                    {events.map(event => (
                        <div key={event.id} style={{
                            padding: "1.5rem", borderRadius: "1.5rem", background: "white", 
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between",
                            border: "1px solid #f1f5f9"
                        }}>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                                    {getCategoryIcon(event.categories?.[0]?.title || "")}
                                    <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{event.date || "Recent"}</span>
                                </div>
                                <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#1e293b" }}>{event.title}</h3>
                                <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1rem" }}>{event.categories?.[0]?.title || "Environmental"}</p>
                            </div>
                            <a href={event.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "#6366f1", fontWeight: "bold", textDecoration: "none" }}>
                                View Details &rarr;
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

