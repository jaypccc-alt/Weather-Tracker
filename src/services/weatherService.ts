import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeather = async (lat: number, lon: number) => {
    try {
        const response = await axios.get(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        if (!response.data || !response.data.main || !response.data.weather) {
            throw new Error("Invalid data received");
        }

        return {
            city: response.data.name || "Unknown City",
            temp: Math.round(response.data.main.temp),
            description: response.data.weather[0]?.description || "No description",
            icon: response.data.weather[0]?.icon || "01d"
        };
    } catch (error) {
        console.error("Weather API Error:", error);
        throw error;
    }
};
