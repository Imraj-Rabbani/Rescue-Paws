import { useEffect, useState } from 'react';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async (location = '') => {
    try {
      setLoading(true);
      const res = await fetch(
        'http://localhost:4000/api/volunteers/'
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Meet Our Volunteers</h1>

      <form onSubmit={handleSearch} className="flex justify-center mb-6">
        <input
          type="text"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          placeholder="Search by location"
          className="border rounded-l px-4 py-2 w-64"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div className="divide-y">
          {volunteers.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">No volunteers found.</p>
          ) : (
            volunteers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center py-4"
              >
                <div>
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  <p className="text-gray-600">{user.location || 'Location not set'}</p>
                <p className="text-sm mt-2">{user.bio || 'No bio available.'}</p>
                </div>
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="volunteer"
                  className="w-16 h-16 rounded-xl object-cover"
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
