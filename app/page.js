"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [scores, setScores] = useState([]);

  // Fetch teams, games, scores
  const fetchData = async () => {
    const [teamsRes, gamesRes, scoresRes] = await Promise.all([
      fetch("/api/teams"),
      fetch("/api/games"),
      fetch("/api/scores"),
    ]);

    const teamsData = await teamsRes.json();
    const gamesData = await gamesRes.json();
    const scoresData = await scoresRes.json();

    setTeams(teamsData);
    setGames(gamesData);
    setScores(scoresData);
  };

  useEffect(() => {
    fetchData();

    // Poll every 3s
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Calculate total score per team
  const getTotalScore = (teamId) =>
    scores
      .filter((s) => s.teamId === teamId)
      .reduce((acc, curr) => acc + curr.score, 0);

  // Sort teams by total score descending
  const sortedTeams = [...teams].sort((a, b) => getTotalScore(b.id) - getTotalScore(a.id));

  return (
  <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          🏆 Live Scoreboard
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-300 text-gray-900 uppercase text-sm font-semibold">
              <tr>
                <th className="px-4 py-3 border-r border-gray-400 text-left">Team</th>
                {games.map((g) => (
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
                  <tr
                    key={team.id}
                    className={`border-b border-gray-300 ${
                      isTop ? "bg-yellow-100 font-bold" : index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 border-r border-gray-300">{team.name}</td>
                    {games.map((g) => {
                      const scoreObj = scores.find(s => s.teamId === team.id && s.gameId === g.id);
                      return (
                        <td key={g.id} className="px-4 py-3 border-r border-gray-300 text-center">
                          {scoreObj?.score || 0}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center font-semibold">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

       
      </div>
    </div>
  );
}