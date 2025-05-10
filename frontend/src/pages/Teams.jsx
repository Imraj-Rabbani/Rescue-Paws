import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTeams = async (name = '') => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/teams/all${name ? `?name=${encodeURIComponent(name)}` : ''}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch teams');

      setTeams(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTeams(searchName);
  };

  const handleViewTeam = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar with Search */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">All Rescue Teams</h1>
                
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="Search by team name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                      className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                  >
                    Search
                  </button>
                </form>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-3">Quick Filters</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => fetchTeams('Rescue')}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-full transition"
                    >
                      Rescue Teams
                    </button>
                    <button 
                      onClick={() => fetchTeams('Medical')}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-full transition"
                    >
                      Medical Teams
                    </button>
                    <button 
                      onClick={() => fetchTeams()}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-full transition"
                    >
                      Show All
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <div className="text-red-600">{error}</div>
                </div>
              ) : teams.length === 0 ? (
                <div className="col-span-2">
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No teams found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search or filter</p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {teams.map((team) => (
                    <div
                      key={team._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                    >
                      <div className="p-6">
                        <div className="flex flex-col">
                          <h2 className="text-xl font-semibold text-blue-700 mb-2">{team.name}</h2>
                          <div className="flex items-center text-gray-600 mb-3">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>Area: {team.area || 'Not specified'}</span>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Created by: <span className="font-medium">{team.creator?.name || 'Unknown'}</span></p>
                          </div>

                          <div className="mb-4">
                            <p className="font-semibold text-gray-800 mb-1">Members:</p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {team.members?.length > 0 ? (
                                team.members.map((member) => (
                                  <li key={member._id} className="flex items-center">
                                    <span className="truncate">{member.name} ({member.email})</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500">No members yet</li>
                              )}
                            </ul>
                          </div>

                          <div className="mt-auto pt-4 border-t border-gray-100">
                            <button 
                              onClick={() => handleViewTeam(team._id)}
                              className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-4 rounded-full transition duration-200"
                            >
                              View Team Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Teams;