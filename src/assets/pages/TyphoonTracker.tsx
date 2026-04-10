import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getActiveStorms } from "../../services/stormService";
import { Radio } from "lucide-react";

// --- 📡 STYLING & ICONS ---
const createEmojiIcon = (emoji: string) => L.divIcon({
    html: `<div style="font-size: 32px; display: flex; justify-content: center; align-items: center;">${emoji}</div>`,
    className: "emoji-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const icons = {
    typhoon: createEmojiIcon("🌪️"),
    storm: createEmojiIcon("🌀"),
    lpa: createEmojiIcon("⛈️")
};

// 🛰️ PURSUIT HELPER: This component moves the camera to follow the storm
const MapPursuit = ({ coords }: { coords: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 6, { animate: true, duration: 3 });
        }
    }, [coords, map]);
    return null;
};

export const TyphoonTracker = () => {
    const [radarTime, setRadarTime] = useState<number | null>(null);
    const [activeStorms, setActiveStorms] = useState<any[]>([]);
    const [trackingCoords, setTrackingCoords] = useState<[number, number] | null>(null);
    const [trackingName, setTrackingName] = useState<string>("");

    const refreshData = async () => {
        // 1. Fetch Radar
        fetch("https://api.rainviewer.com/public/weather-maps.json")
            .then(res => res.json()).then(data => setRadarTime(data.radar.past[data.radar.past.length - 1].time));
        
        // 2. Fetch Storms
        const storms = await getActiveStorms();
        setActiveStorms(storms);

        // 🎯 PURSUIT LOGIC: Find the most severe storm to track
        if (storms.length > 0) {
            // Sort by severity (Red alert first)
            const sortedStorms = [...storms].sort((a, b) => {
                const priority: any = { "Red": 3, "Orange": 2, "Green": 1 };
                return (priority[b.severity] || 0) - (priority[a.severity] || 0);
            });
            
            const topStorm = sortedStorms[0];
            setTrackingCoords(topStorm.coords);
            setTrackingName(topStorm.name);
        }
    };

    useEffect(() => {
        refreshData();
        // 🔄 PURSUIT REFRESH: Check movement every 15 minutes
        const interval = setInterval(refreshData, 900000);
        return () => clearInterval(interval);
    }, []);

    const getStormData = (severity: string) => {
        if (severity === "Red") return { icon: icons.typhoon, color: "#ef4444" };
        if (severity === "Orange") return { icon: icons.storm, color: "#f97316" };
        return { icon: icons.lpa, color: "#eab308" };
    };

    return (
        <div style={{ height: "calc(100vh - 80px)", width: "100%", position: "relative" }}>
            
            {/* 🛰️ TRACKER OVERLAY: PURSUIT MODE INDICATOR */}
            <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 1000, pointerEvents: "none" }}>
                <div className="glass-effect" style={{ padding: "1rem 1.5rem", borderRadius: "1rem", boxShadow: "0 10px 15px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "15px" }}>
                    <div style={{ position: "relative" }}>
                        <Radio size={24} color="#ef4444" className="animate-pulse" />
                        <div style={{ position: "absolute", top: "-2px", right: "-2px", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%" }}></div>
                    </div>
                    <div>
                        <h2 style={{ fontSize: "1rem", fontWeight: "bold", color: "#1e293b", margin: 0 }}>Pursuit Mode Active</h2>
                        <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            {trackingCoords ? `Locked On: ${trackingName}` : "Scanning for targets..."}
                        </p>
                    </div>
                </div>
            </div>

            {/* MAP CONTAINER */}
            <MapContainer center={[14.5995, 120.9842]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                
                {radarTime && (
                    <TileLayer url={`https://tilecache.rainviewer.com/v2/radar/${radarTime}/256/{z}/{x}/{y}/4/1_1.png`} opacity={0.4} zIndex={100} maxNativeZoom={6} />
                )}

                {/* 🎯 PURSUIT ACTIVATION */}
                <MapPursuit coords={trackingCoords} />

                {activeStorms.map(storm => {
                    const data = getStormData(storm.severity);
                    return (
                        <div key={storm.id}>
                            <Circle center={storm.coords} radius={200000} pathOptions={{ color: data.color, fillColor: data.color, fillOpacity: 0.1 }} />
                            <Marker position={storm.coords} icon={data.icon}>
                                <Popup>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ color: data.color, fontWeight: "bold" }}>{storm.severity} ALERT</div>
                                        <h3 style={{ margin: "5px 0" }}>{storm.name}</h3>
                                        <p style={{ margin: 0, fontSize: "0.8rem" }}>{storm.description}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        </div>
                    )
                })}
            </MapContainer>
        </div>
    );
};
