import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/teams/all');
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch teams');

        setTeams(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <>
    <Navbar/>
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">All Rescue Teams</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading teams...</p>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold text-blue-700">{team.name}</h2>
              <p className="text-gray-600">Area: {team.area}</p>
              <p className="text-sm mt-2">Created by: <span className="font-medium">{team.creator?.name || 'Unknown'}</span></p>

              <div className="mt-4">
                <p className="font-semibold mb-1">Members:</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {team.members?.length > 0 ? (
                    team.members.map((member) => (
                      <li key={member._id}>{member.name} ({member.email})</li>
                    ))
                  ) : (
                    <li>No members yet</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>

  );
};

export default Teams;
