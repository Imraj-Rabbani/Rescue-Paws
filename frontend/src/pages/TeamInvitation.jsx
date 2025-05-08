import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TeamInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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
      setError(null);
      setSuccessMessage(null);
      
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
      
      setSuccessMessage(`Invitation ${status} successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="flex space-x-3">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Team Invitations</h1>
          <button 
            onClick={() => navigate('/my-team')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Back to My Team
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {invitations.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No pending invitations</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any team invitations at this time.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/my-team')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Your Teams
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map(invite => (
              <div 
                key={invite._id} 
                className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${
                  invite.status === 'accepted' ? 'border-green-500' :
                  invite.status === 'rejected' ? 'border-red-500' :
                  'border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {invite.team?.name || 'Unknown Team'}
                    </h3>
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>From: {invite.from?.name || 'Unknown User'}</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>Sent: {new Date(invite.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    invite.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    invite.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {invite.status || 'pending'}
                  </span>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => handleRespond(invite._id, 'accepted')}
                    disabled={invite.status !== 'pending'}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                      invite.status !== 'pending' 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    {invite.status === 'accepted' ? (
                      <>
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Accepted
                      </>
                    ) : 'Accept Invitation'}
                  </button>
                  <button
                    onClick={() => handleRespond(invite._id, 'rejected')}
                    disabled={invite.status !== 'pending'}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                      invite.status !== 'pending' 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                  >
                    {invite.status === 'rejected' ? (
                      <>
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Rejected
                      </>
                    ) : 'Decline Invitation'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TeamInvitations;