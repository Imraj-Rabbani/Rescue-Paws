import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting

const MyTeam = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    // Fetch the teams from the backend
    const fetchTeams = async () => {
      try {
        // Check if token exists
        // Note: We don't need to check localStorage anymore since we're using cookies
        /* const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        } */

        const response = await fetch('http://localhost:4000/api/teams/my-teams', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // This will include cookies in the request
        });

        const data = await response.json();
        console.log('API Response:', data);
        
        // Check for authentication error
        if (data.success === false && data.message?.includes('Not Authorized')) {
          console.log('Authentication failed. Redirecting to login...');
          setError('Authentication failed. Please log in again.');
          
          // Clear invalid token
          localStorage.removeItem('token');
          
          // You might want to redirect to login page
          // Uncomment the next line if you want automatic redirect
          // navigate('/login');
          
          setLoading(false);
          return;
        }

        // Handle regular response
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch teams');
        }
        
        if (Array.isArray(data)) {
          setTeams(data);
        } else if (data && typeof data === 'object') {
          // If data is an object and has a teams property that is an array
          if (Array.isArray(data.teams)) {
            setTeams(data.teams);
          } else if (data.data && Array.isArray(data.data)) {
            // Another common pattern is to have data nested in a data property
            setTeams(data.data);
          } else {
            // If we can't find an array to use, set an empty array
            console.error('Unexpected API response format:', data);
            setTeams([]);
            setError('Unexpected data format received from server');
          }
        } else {
          setTeams([]);
          setError('Invalid data received from server');
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">My Teams</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-300 rounded-md">
          <p className="text-red-500">{error}</p>
          {error.includes('authentication') || error.includes('Authorized') || error.includes('log in') ? (
            <button 
              onClick={() => navigate('/login')} 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Go to Login
            </button>
          ) : null}
        </div>
      ) : (
        <div>
          {teams.length === 0 ? (
            <p>You are not a member of any team.</p>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <div key={team._id} className="p-4 border rounded-xl shadow-md">
                  <h2 className="text-xl font-bold">{team.name}</h2>
                  <p className="text-gray-600">Location: {team.area}</p>
                  <p className="text-gray-600">Created by: {team.creator?.name || 'Unknown'}</p>
                  <p className="text-gray-600">Members:</p>
                  <ul className="list-disc ml-6">
                    {team.members?.map((member) => (
                      <li key={member._id}>{member.name} ({member.email})</li>
                    )) || <li>No members found</li>}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyTeam;