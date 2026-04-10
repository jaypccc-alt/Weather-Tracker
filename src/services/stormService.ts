import axios from "axios";

export const getActiveStorms = async () => {
    try {
        // Correct GDACS API endpoint for event listing
        const response = await axios.get("https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventtype=TC");

        if (response.data && response.data.features) {
            // Filter to only show CURRENTLY ACTIVE storms
            const currentStorms = response.data.features.filter((f: any) => f.properties.iscurrent === "true");

            return currentStorms.map((storm: any) => ({
                id: storm.properties.eventid,
                name: storm.properties.name,
                type: storm.properties.eventtype,
                severity: storm.properties.alertlevel, // Green, Orange, or Red alerts
                status: storm.properties.alertscore,
                coords: [storm.geometry.coordinates[1], storm.geometry.coordinates[0]], // Lat, Lon
                description: storm.properties.description
            }));
        }
        return [];
    } catch (error) {
        console.error("GDACS API Error:", error);
        return [];
    }
};
