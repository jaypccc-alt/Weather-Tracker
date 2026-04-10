import { useState } from "react";
import { Search, MapPin, CloudRain, ThermometerSun, AlertCircle } from "lucide-react";
import { getWeather } from "../../services/weatherService";
import { searchLocation } from "../../services/geocodingService";

interface WeatherData {
    city: string;
    temp: number;
    description: string;
    icon: string;
}

export const Temperature = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);
        setWeather(null);

        try {
            // 1. Geocode the city name to coordinates
            const location = await searchLocation(searchQuery);
            
            if (!location) {
                setError("City or town not found. Please try again.");
                return;
            }

            // 2. Fetch weather using coordinates
            const data = await getWeather(location.lat, location.lon);
            setWeather(data);
        } catch (err) {
            console.error("Search Error:", err);
            setError("Failed to fetch weather data. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            
            <header style={{ marginBottom: "3rem" }}>
                <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "2.2rem", fontWeight: "bold" }}>
                    <ThermometerSun size={36} color="#4f46e5" /> Weather Hub
                </h1>
                <p style={{ color: "#64748b", marginTop: "0.5rem" }}>Search any city or town around the world.</p>
            </header>

            {/* 🔍 SEARCH BAR SECTION */}
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginBottom: "3rem" }}>
                <div style={{ display: "flex", flex: 1, background: "white", borderRadius: "12px", padding: "12px 20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                    <Search color="#94a3b8" style={{ marginRight: "10px" }} />
                    <input 
                        placeholder="Enter city or town name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: "1rem" }}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        background: "#4f46e5", color: "white", border: "none", padding: "0 30px", borderRadius: "12px", 
                        fontWeight: "bold", cursor: "pointer", transition: "opacity 0.2s" 
                    }}
                >
                    {loading ? "..." : "Search"}
                </button>
            </form>

            {/* 📍 ERROR MESSAGE */}
            {error && (
                <div style={{ color: "#ef4444", background: "#fef2f2", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #fee2e2", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {/* 🌈 RESULT DISPLAY (NO MAP) */}
            {weather && !loading && (
                <div style={{
                    background: "linear-gradient(135deg, #1e293b, #0f172a)",
                    color: "white",
                    padding: "3rem 2rem",
                    borderRadius: "2rem",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.1 }}>
                        <ThermometerSun size={200} />
                    </div>

                    <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#60a5fa", fontWeight: "bold", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "2px", marginBottom: "1rem" }}>
                            <MapPin size={14} /> Official Report
                        </div>
                        
                        <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{weather.city}</h2>
                        
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
                            <img src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} alt="weather icon" style={{ width: "120px" }} />
                            <div style={{ textAlign: "left" }}>
                                <div style={{ fontSize: "5rem", fontWeight: "bold", lineHeight: 1 }}>{weather.temp}°</div>
                                <div style={{ fontSize: "1.2rem", color: "#94a3b8", textTransform: "capitalize" }}>{weather.description}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: "2rem", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "1rem", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                            <CloudRain size={20} color="#38bdf8" />
                            <span style={{ fontSize: "0.9rem", color: "#e2e8f0" }}>Conditions are currently stable for travel and outdoors.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* LOADING STATE */}
            {loading && (
                <div style={{ padding: "4rem" }}>
                    <div className="animate-spin" style={{ width: "40px", height: "40px", border: "4px solid #e2e8f0", borderTopColor: "#4f46e5", borderRadius: "50%", margin: "0 auto" }}></div>
                    <p style={{ marginTop: "1.5rem", color: "#64748b" }}>Querying global satellite network...</p>
                </div>
            )}
        </div>
    );
};