import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchVolunteers = async (location = '') => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/volunteers${location ? `?location=${encodeURIComponent(location)}` : ''}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch volunteers');
      const data = await res.json();
      setVolunteers(data);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVolunteers(searchLocation);
  };

  const handleViewProfile = (volunteerId) => {
    navigate(`/volunteers/${volunteerId}`);
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
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Meet Our Volunteers</h1>
                
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Search by location"
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
                      onClick={() => fetchVolunteers('Moghbazar')}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-full transition"
                    >
                      Moghbazar
                    </button>
                    <button 
                      onClick={() => fetchVolunteers('Badda')}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-full transition"
                    >
                      Badda
                    </button>
                    <button 
                      onClick={() => fetchVolunteers()}
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
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {volunteers.length === 0 ? (
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
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No volunteers found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your search or filter</p>
                      </div>
                    </div>
                  ) : (
                    volunteers.map((user) => (
                      <div
                        key={user._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                      >
                        <div className="p-6">
                          <div className="flex items-start space-x-4">
                            <img
                              src="/profilePhoto.jpeg"
                              alt={user.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                            />
                            <div>
                              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                              <div className="flex items-center mt-1 text-gray-600">
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
                                <span>{user.location || 'Location not set'}</span>
                              </div>
                              <div className="mt-1 flex items-center">
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                  {user.points || 0} Rescue Points
                                </span>
                              </div>
                              <p className="mt-3 text-gray-600 line-clamp-2">
                                {user.bio || 'No bio available.'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <button 
                              onClick={() => handleViewProfile(user._id)}
                              className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-4 rounded-full transition duration-200"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}