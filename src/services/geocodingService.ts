import axios from "axios";

export const searchLocation = async (query: string) => {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&addressdetails=1`
        );

        if (response.data && response.data.length > 0) {
            const place = response.data[0];
            return {
                lat: parseFloat(place.lat),
                lon: parseFloat(place.lon),
                displayName: place.display_name,
            };
        }
        return null;
    } catch (error) {
        console.error("Geocoding Error:", error);
        return null;
    }
};
