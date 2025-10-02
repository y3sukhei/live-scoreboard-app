"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const [teams, setTeams] = useState([]);
    const [games, setGames] = useState([]);
    const [scores, setScores] = useState([]);
    const [newTeam, setNewTeam] = useState("");
    const [newGame, setNewGame] = useState("");

    // Fetch all data
    const fetchData = async () => {
        const [tRes, gRes, sRes] = await Promise.all([
            fetch("/api/teams"),
            fetch("/api/games"),
            fetch("/api/scores"),
        ]);
        const teamsData = await tRes.json();
        const gamesData = await gRes.json();
        let scoresData = await sRes.json();

        teamsData.forEach(team => {
            gamesData.forEach(game => {
                if (!scoresData.find(s => s.teamId === team.id && s.gameId === game.id)) {
                    scoresData.push({ teamId: team.id, gameId: game.id, score: 0 });
                }
            });
        });

        setTeams(teamsData);
        setGames(gamesData);
        setScores(scoresData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ---------- TEAM FUNCTIONS ----------
    const addTeam = async () => {
        await fetch("/api/teams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newTeam }),
        });
        setNewTeam("");
        fetchData();
    };

    const updateTeam = async (id, newName) => {
        await fetch("/api/teams", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, name: newName }),
        });
        fetchData();
    };

    const deleteTeam = async (id) => {
        await fetch("/api/teams", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        fetchData();
    };

    // ---------- GAME FUNCTIONS ----------
    const addGame = async () => {
        await fetch("/api/games", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newGame }),
        });
        setNewGame("");
        fetchData();
    };

    const updateGame = async (id, newName) => {
        await fetch("/api/games", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, name: newName }),
        });
        fetchData();
    };

    const deleteGame = async (id) => {
        await fetch("/api/games", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        fetchData();
    };

    // ---------- SCORE FUNCTIONS ----------
    const updateScore = async (teamId, gameId, score) => {
        await fetch("/api/scores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamId, gameId, score: Number(score) }),
        });
        fetchData();
    };

    const getScore = (teamId, gameId) => {
        const found = scores.find((s) => s.teamId === teamId && s.gameId === gameId);
        return found ? found.score : 0;
    };

    const getTotalScore = (teamId) => games.reduce((acc, g) => acc + getScore(teamId, g.id), 0);
    const sortedTeams = [...teams].sort((a, b) => getTotalScore(b.id) - getTotalScore(a.id));

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">⚙️ Admin Dashboard</h1>

                {/* TEAMS */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-700">Teams</h2>
                    <div className="flex mb-4 gap-2">
                        <input type="text" value={newTeam} onChange={e => setNewTeam(e.target.value)} placeholder="New team name" className="flex-1 border rounded px-3 py-1 text-gray-700" />
                        <button onClick={addTeam} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Add Team</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-gray-800 rounded-lg">
                            <thead className="bg-gray-300 font-semibold text-gray-900">
                                <tr>
                                    <th className="px-4 py-3 border-r border-gray-400 text-left">ID</th>
                                    <th className="px-4 py-3 border-r border-gray-400 text-left">Name</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams.map(team => (
                                    <tr key={team.id} className="border-b border-gray-300 hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 border-r border-gray-300">{team.id}</td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            <input type="text" defaultValue={team.name} onBlur={e => updateTeam(team.id, e.target.value)} className="border rounded px-2 py-1 w-full" />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={() => deleteTeam(team.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* GAMES */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-700">Games</h2>
                    <div className="flex mb-4 gap-2">
                        <input type="text" value={newGame} onChange={e => setNewGame(e.target.value)} placeholder="New game name" className="flex-1 border rounded px-3 py-1 text-gray-700" />
                        <button onClick={addGame} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Add Game</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-gray-800 rounded-lg">
                            <thead className="bg-gray-300 font-semibold text-gray-900">
                                <tr>
                                    <th className="px-4 py-3 border-r border-gray-400 text-left">ID</th>
                                    <th className="px-4 py-3 border-r border-gray-400 text-left">Name</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {games.map(game => (
                                    <tr key={game.id} className="border-b border-gray-300 hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 border-r border-gray-300">{game.id}</td>
                                        <td className="px-4 py-3 border-r border-gray-300">
                                            <input type="text" defaultValue={game.name} onBlur={e => updateGame(game.id, e.target.value)} className="border rounded px-2 py-1 w-full" />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={() => deleteGame(game.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* SCORES */}
                <section>
                    <h2 className="text-2xl font-semibold mb-3 text-gray-700">Scores</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-gray-800 rounded-lg">
                            <thead className="bg-gray-300 font-semibold text-gray-900">
                                <tr>
                                    <th className="px-4 py-3 border-r border-gray-400">Team</th>
                                    {games.map(g => (
                                        <th key={g.id} className="px-4 py-3 border-r border-gray-400 text-center">{g.name}</th>
                                    ))}
                                    <th className="px-4 py-3 text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTeams.map((team, index) => {
                                    const total = getTotalScore(team.id);
                                    const isTop = index === 0;
                                    return (
                                        <tr key={team.id} className={`border-b border-gray-300 ${isTop ? 'bg-yellow-100 font-bold' : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                            <td className="px-4 py-3 border-r border-gray-300">{team.name}</td>
                                            {games.map(g => (
                                                <td key={g.id} className="px-2 py-1 border-r border-gray-300 text-center">
                                                    <input type="number" defaultValue={getScore(team.id, g.id)} onBlur={e => updateScore(team.id, g.id, e.target.value)} className="border rounded px-2 py-1 w-full text-center" />
                                                </td>
                                            ))}
                                            <td className="px-4 py-3 text-center font-semibold">{total}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}