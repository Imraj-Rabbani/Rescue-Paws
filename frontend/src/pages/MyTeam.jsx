import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const MyTeam = () => {
  const [teams, setTeams] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teams
        const teamsResponse = await fetch(
          "http://localhost:4000/api/teams/my-teams",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const teamsData = await teamsResponse.json();

        if (
          teamsData.success === false &&
          teamsData.message?.includes("Not Authorized")
        ) {
          setError("Authentication failed. Please log in again.");
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        if (!teamsResponse.ok) {
          throw new Error(teamsData.message || "Failed to fetch teams");
        }

        // Process teams data
        let processedTeams = [];
        if (Array.isArray(teamsData)) {
          processedTeams = teamsData;
        } else if (teamsData?.teams && Array.isArray(teamsData.teams)) {
          processedTeams = teamsData.teams;
        } else if (teamsData?.data && Array.isArray(teamsData.data)) {
          processedTeams = teamsData.data;
        } else {
          console.error("Unexpected API response format:", teamsData);
          setError("Unexpected data format received from server");
        }
        setTeams(processedTeams);

        // Fetch volunteers
        const volunteersResponse = await fetch(
          "http://localhost:4000/api/volunteers",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const volunteersData = await volunteersResponse.json();

        if (!volunteersResponse.ok) {
          throw new Error(
            volunteersData.message || "Failed to fetch volunteers"
          );
        }

        setVolunteers(volunteersData.data || volunteersData);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      setUploadMessage("Please select an image to upload.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      const res = await fetch("http://localhost:4000/api/upload/rescue", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadMessage("Image uploaded successfully!");
      setImage(null);
      setCaption("");
    } catch (err) {
      console.error(err);
      setUploadMessage(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddVolunteers = async (e) => {
    e.preventDefault();
    if (!selectedTeam || selectedVolunteers.length === 0) {
      setError("Please select a team and at least one volunteer");
      return;
    }

    try {
      console.log("Sending request with:", {
        teamId: selectedTeam,
        volunteerIds: selectedVolunteers,
      });

      const response = await fetch("http://localhost:4000/api/invites/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add this line
        },
        credentials: "include",
        body: JSON.stringify({
          teamId: selectedTeam,
          volunteerIds: selectedVolunteers,
        }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitations");
      }

      setError(null);
      setSelectedTeam(null);
      setSelectedVolunteers([]);
      setUploadMessage(
        `Invitations sent successfully to ${data.length} volunteers!`
      );
    } catch (err) {
      console.error("Error in handleAddVolunteers:", err);
      setError(err.message || "Failed to send invitations");
    }
  };

  const toggleVolunteerSelection = (volunteerId) => {
    setSelectedVolunteers((prev) =>
      prev.includes(volunteerId)
        ? prev.filter((id) => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>

            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            </div>

            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 border rounded-lg shadow-sm bg-white">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Teams</h1>

        {/* Add Volunteers Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Add Volunteers to Team
          </h2>
          <form onSubmit={handleAddVolunteers} className="space-y-4">
            <div>
              <label
                htmlFor="team-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Team
              </label>
              <select
                id="team-select"
                value={selectedTeam || ""}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Volunteers
              </label>
              <div className="relative">
                <div className="border border-gray-300 rounded-md p-2 max-h-60 overflow-y-auto">
                  {volunteers.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No volunteers available
                    </p>
                  ) : (
                    volunteers.map((volunteer) => (
                      <div
                        key={volunteer._id}
                        className="flex items-center p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="checkbox"
                          id={`volunteer-${volunteer._id}`}
                          checked={selectedVolunteers.includes(volunteer._id)}
                          onChange={() =>
                            toggleVolunteerSelection(volunteer._id)
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`volunteer-${volunteer._id}`}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {volunteer.name} ({volunteer.email})
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedTeam || selectedVolunteers.length === 0}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                !selectedTeam || selectedVolunteers.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
            >
              Add Selected Volunteers
            </button>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {uploadMessage && !error && (
              <p className="text-sm text-green-600">{uploadMessage}</p>
            )}
          </form>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Upload Rescue Image
          </h2>
          <form onSubmit={handleImageUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Image</label>
            <div className="flex items-center space-x-4">
              <label className="flex flex-col items-center px-4 py-2 bg-white rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50">
                <span className="text-sm font-medium text-gray-700">
                  {image ? image.name : 'Choose file'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                />
              </label>
              {image && (
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe the rescue operation"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className={`px-4 py-2 rounded-md text-white font-medium ${isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>

          {uploadMessage && (
            <p className={`text-sm mt-2 ${uploadMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {uploadMessage}
            </p>
          )}
        </form>
          

        </div>

        {/* Teams Section */}
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-semibold mb-4">My Teams</h1>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-300 rounded-md">
              <p className="text-red-500">{error}</p>
              {error.includes("authentication") ||
              error.includes("Authorized") ||
              error.includes("log in") ? (
                <button
                  onClick={() => navigate("/login")}
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
                    <div
                      key={team._id}
                      className="p-4 border rounded-xl shadow-md"
                    >
                      <h2 className="text-xl font-bold">{team.name}</h2>
                      <p className="text-gray-600">Location: {team.area}</p>
                      <p className="text-gray-600">
                        Created by: {team.creator?.name || "Unknown"}
                      </p>
                      <p className="text-gray-600">Members:</p>
                      <ul className="list-disc ml-6">
                        {team.members?.map((member) => (
                          <li key={member._id}>
                            {member.name} ({member.email})
                          </li>
                        )) || <li>No members found</li>}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyTeam;
