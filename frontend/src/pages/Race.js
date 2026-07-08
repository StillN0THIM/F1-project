import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

function Race() {
    const { id } = useParams();
    // useParams reads the :id from the URL e.g. /races/5 gives us id = "5"

    const [results, setResults] = useState([]);
    const [raceInfo, setRaceInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/races/${id}`)
            .then(res => {
                const race = res.data.MRData.RaceTable.Races[0];
                // Grabs the first (and only) race from the response
                setRaceInfo(race);
                setResults(race.Results);
                setLoading(false);
            })
            .catch(err => console.error("Failed to fetch race:", err));
    }, [id]);
    // id in the dependency array means re-fetch if the URL id changes

    if (loading) return <div>Loading race results...</div>;

    return (
        <div>
            <h1>{raceInfo.raceName}</h1>
            <p>{raceInfo.Circuit.circuitName} — {raceInfo.date}</p>
            {/* Race header showing name, circuit and date */}

            <table>
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Driver</th>
                        <th>Team</th>
                        <th>Time</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map(entry => (
                        <tr key={entry.Driver.driverId}>
                            <td>{entry.position}</td>
                            <td>{entry.Driver.givenName} {entry.Driver.familyName}</td>
                            <td>{entry.Constructor.name}</td>
                            <td>{entry.Time ? entry.Time.time : entry.status}</td>
                            {/* If no time exists (DNF etc) show the status instead */}
                            <td>{entry.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Race;