import { Link } from "react-router-dom";
import { CloudRain, Thermometer, Globe } from "lucide-react";

export const Navbar = () => {
    return (
        <nav style={{
            padding: "1rem 2rem",
            background: "linear-gradient(to right, #1e293b, #334155)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontWeight: "bold" }}>
                <CloudRain size={24} color="#0ea5e9" />
                <span style={{ fontSize: "1.2rem" }}> Weather Tracker </span>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
                <Link to="/" style={linkStyle}>
                    <Globe size={18} /> Home </Link>
                <Link to="/typhoon-tracker" style={linkStyle}>
                    <CloudRain size={18} /> Typhoon Tracker </Link>
                <Link to="/temperature" style={linkStyle}>
                    <Thermometer size={18} /> Temperature </Link>
            </div>
        </nav>
    );
};

const linkStyle = {
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
};