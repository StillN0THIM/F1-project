import { useState, useEffect } from "react";
import api from "../utils/api";

function Calendar() {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/calendar")
            .then(res => {
                const raceList = res.data.MRData.RaceTable.Races;
                // Jolpica wraps all data in MRData — Races is the array we want
                setRaces(raceList);
                setLoading(false);
            })
            .catch(err => console.error("Failed to fetch calendar:", err));
    }, []);

    if (loading) return <div>Loading calendar...</div>;

    return (
        <div>
            <h1>2025 Race Calendar</h1>
            <table>
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>Grand Prix</th>
                        <th>Circuit</th>
                        <th>Location</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {races.map(race => (
                        <tr key={race.round}>
                            <td>{race.round}</td>
                            <td>{race.raceName}</td>
                            <td>{race.Circuit.circuitName}</td>
                            <td>{race.Circuit.Location.locality}, {race.Circuit.Location.country}</td>
                            <td>{race.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Each race from Jolpica has Circuit and Location nested inside it */}
        </div>
    );
}

export default Calendar;