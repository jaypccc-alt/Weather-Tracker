import axios from "axios";

// NASA EONET (Earth Observatory Natural Event Tracker) API
const BASE_URL = "https://eonet.gsfc.nasa.gov/api/v3/events";

export interface NaturalEvent {
    id: string;
    title: string;
    description: string;
    link: string;
    categories: { id: string; title: string }[];
    date: string;
}

export const getNaturalEvents = async () => {
    try {
        const response = await axios.get(BASE_URL);
        
        if (response.data && response.data.events) {
            return response.data.events.map((event: any) => ({
                id: event.id,
                title: event.title,
                description: event.description || "No detailed description available.",
                link: event.sources[0]?.url || "#",
                categories: event.categories,
                date: event.geometry && event.geometry[0] && event.geometry[0].date 
                    ? new Date(event.geometry[0].date).toLocaleDateString()
                    : "Live Intel"
            }));
        }
        return [];
    } catch (error) {
        console.error("NASA EONET API Error:", error);
        return [];
    }
};
