import { useState, useEffect } from "react";
import { getNaturalEvents } from "../../services/newsService";
import type { NaturalEvent } from "../../services/newsService";
import { Flame, Bell, Waves, Wind, ExternalLink, RefreshCcw } from "lucide-react";

export const NewsFeed = () => {
    const [events, setEvents] = useState<NaturalEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        getNaturalEvents().then(data => {
            setEvents(data);
            setLoading(false);
        });
    }, []);

    const filteredEvents = filter === "All" 
        ? events 
        : events.filter(e => e.categories[0]?.title.includes(filter));

    // Helper to get matching category icon
    const getCategoryIcon = (category: string) => {
        if (category.includes("Fire")) return <Flame color="#f43f5e" size={24} />;
        if (category.includes("Storm")) return <Wind color="#38bdf8" size={24} />;
        if (category.includes("Flood") || category.includes("Water")) return <Waves color="#3b82f6" size={24} />;
        return <Bell color="#eab308" size={24} />;
    };

    if (loading) return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh", color: "#1e293b" }}>
            <RefreshCcw className="animate-spin" size={48} style={{ marginBottom: "20px", color: "#6366f1" }} />
            <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Connecting to NASA Intelligence Feed...</p>
        </div>
    );

    return (
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", color: "#1e293b" }}>
            
            {/* 🏷️ HEADER & FILTERS */}
            <div style={{ marginBottom: "3rem", textAlign: "center" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem", background: "linear-gradient(to right, #4f46e5, #0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Environmental Intel
                </h1>
                <p style={{ color: "#64748b", marginBottom: "2rem" }}>Real-time natural event tracking powered by NASA EONET</p>
                
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                    {["All", "Wildfires", "Severe Storms", "Water"].map(btn => (
                        <button 
                            key={btn}
                            onClick={() => setFilter(btn)}
                            style={{
                                background: filter === btn ? "#6366f1" : "white",
                                color: filter === btn ? "white" : "#64748b", 
                                padding: "10px 20px", borderRadius: "50px", border: "1px solid #e2e8f0",
                                cursor: "pointer", transition: "all 0.3s", fontWeight: "bold",
                                boxShadow: filter === btn ? "0 4px 6px -1px rgba(99, 102, 241, 0.4)" : "none"
                            }}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </div>

            {/* 🗞️ NEWS GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {filteredEvents.map(event => (
                    <div key={event.id} className="glass-effect" style={{
                        padding: "1.5rem", borderRadius: "1.5rem", border: "1px solid rgba(0,0,0,0.05)",
                        display: "flex", flexDirection: "column", justifyContent: "space-between",
                        transition: "transform 0.3s", cursor: "default", background: "white", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
                    }}>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                {getCategoryIcon(event.categories[0]?.title || "")}
                                <span style={{ fontSize: "0.75rem", background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "50px", fontWeight: "bold" }}>{event.date}</span>
                            </div>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#1e293b" }}>{event.title}</h3>
                            <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.5rem", lineHeight: "1.5" }}>
                                Category: {event.categories[0]?.title}
                            </div>
                        </div>
                        
                        <a href={event.link} target="_blank" rel="noopener noreferrer" style={{
                            display: "flex", alignItems: "center", gap: "8px", color: "#6366f1",
                            textDecoration: "none", fontWeight: "bold", fontSize: "0.9rem"
                        }}>
                            View NASA Source <ExternalLink size={14} />
                        </a>
                    </div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div style={{ textAlign: "center", padding: "5rem", color: "#64748b" }}>
                    No active {filter} events found right now.
                </div>
            )}
        </div>
    );
};