import { useState, useEffect } from "react";
import api from "../utils/api";

function Standings() {
    const [drivers, setDrivers] = useState([]);
    const [constructors, setConstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    // useState holds our data — starts empty, fills when API responds

    useEffect(() => {
        api.get("/standings")
            .then(res => {
                const data = res.data;
                // Log the full response so we can see exactly what Jolpica returns
                console.log("Standings data:", data);

                const driversList = data.drivers.MRData.StandingsTable.StandingsLists[0].DriverStandings;
                const constructorsList = data.constructors.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
                // Our Rails controller returns { drivers: {...}, constructors: {...} }
                // so we need to go into each one separately

                setDrivers(driversList);
                setConstructors(constructorsList);
                setLoading(false);
            })
            .catch(err => console.error("Failed to fetch standings:", err));
    }, []);
    // useEffect runs once when the page loads — the empty [] means run once only

    if (loading) return <div>Loading standings...</div>;

    return (
        <div>
            <h1>2025 Driver Standings</h1>
            <table>
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Driver</th>
                        <th>Team</th>
                        <th>Points</th>
                        <th>Wins</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map(entry => (
                        <tr key={entry.Driver.driverId}>
                            <td>{entry.position}</td>
                            <td>{entry.Driver.givenName} {entry.Driver.familyName}</td>
                            <td>{entry.Constructors[0].name}</td>
                            <td>{entry.points}</td>
                            <td>{entry.wins}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Loops through each driver and renders a table row */}

            <h1>2025 Constructor Standings</h1>
            <table>
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Team</th>
                        <th>Points</th>
                        <th>Wins</th>
                    </tr>
                </thead>
                <tbody>
                    {constructors.map(entry => (
                        <tr key={entry.Constructor.constructorId}>
                            <td>{entry.position}</td>
                            <td>{entry.Constructor.name}</td>
                            <td>{entry.points}</td>
                            <td>{entry.wins}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Standings;
// Must export Standings not Home — the name must match what App.js imports