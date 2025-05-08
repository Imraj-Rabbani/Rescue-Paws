import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TeamInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/invites/me', {
          credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch invitations');
        setInvitations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitations();
  }, []);

  const handleRespond = async (inviteId, status) => {
    try {
      const response = await fetch(`http://localhost:4000/api/invites/${inviteId}/respond`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to respond');
      
      setInvitations(invitations.map(inv => 
        inv._id === inviteId ? { ...inv, status } : inv
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading invitations...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Team Invitations</h1>
      
      {invitations.length === 0 ? (
        <p>You have no pending invitations.</p>
      ) : (
        <div className="space-y-4">
          {invitations.map(invite => (
            <div key={invite._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="font-semibold text-lg">
                Invitation to join: {invite.team?.name || 'Unknown Team'}
              </h3>
              <p className="text-gray-600">From: {invite.from?.name || 'Unknown User'}</p>
              <p className="text-gray-500 text-sm">
                Sent on: {new Date(invite.createdAt).toLocaleDateString()}
              </p>
              
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleRespond(invite._id, 'accepted')}
                  disabled={invite.status !== 'pending'}
                  className={`px-3 py-1 rounded text-white ${
                    invite.status !== 'pending' 
                      ? 'bg-gray-300' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {invite.status === 'accepted' ? 'Accepted' : 'Accept'}
                </button>
                <button
                  onClick={() => handleRespond(invite._id, 'rejected')}
                  disabled={invite.status !== 'pending'}
                  className={`px-3 py-1 rounded text-white ${
                    invite.status !== 'pending' 
                      ? 'bg-gray-300' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {invite.status === 'rejected' ? 'Rejected' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamInvitations;