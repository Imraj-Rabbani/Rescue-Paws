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
  const [activeTab, setActiveTab] = useState("teams"); // 'teams' or 'upload'
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
      const response = await fetch("http://localhost:4000/api/invites/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          teamId: selectedTeam,
          volunteerIds: selectedVolunteers,
        }),
      });

      const data = await response.json();

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
        <div className="container mx-auto p-4 max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border rounded-lg shadow-sm bg-white">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="p-6 border rounded-lg shadow-sm bg-white">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
            {[...Array(2)].map((_, i) => (
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
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Teams</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("teams")}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === "teams"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              My Teams
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === "upload"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Upload Rescue
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                {error.includes("authentication") ||
                error.includes("Authorized") ||
                error.includes("log in") ? (
                  <button
                    onClick={() => navigate("/login")}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                  >
                    Go to Login
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {activeTab === "teams" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Volunteers Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Manage Team Members
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
                    Available Volunteers
                  </label>
                  <div className="relative">
                    <div className="border border-gray-300 rounded-md p-2 max-h-60 overflow-y-auto bg-gray-50">
                      {volunteers.length === 0 ? (
                        <p className="text-gray-500 text-sm p-2">
                          No volunteers available
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {volunteers.map((volunteer) => (
                            <div
                              key={volunteer._id}
                              className={`flex items-center p-2 rounded ${
                                selectedVolunteers.includes(volunteer._id)
                                  ? "bg-blue-50 border border-blue-200"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={`volunteer-${volunteer._id}`}
                                checked={selectedVolunteers.includes(
                                  volunteer._id
                                )}
                                onChange={() =>
                                  toggleVolunteerSelection(volunteer._id)
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor={`volunteer-${volunteer._id}`}
                                className="ml-2 block text-sm text-gray-900"
                              >
                                <span className="font-medium">
                                  {volunteer.name}
                                </span>
                                <span className="text-gray-500 text-xs block">
                                  {volunteer.email}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedTeam || selectedVolunteers.length === 0}
                  className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${
                    !selectedTeam || selectedVolunteers.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                >
                  Add Selected Volunteers
                </button>

                {uploadMessage && !error && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
                    {uploadMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Teams List Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Teams
              </h2>
              {teams.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No teams
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You are not a member of any team yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div
                      key={team._id}
                      className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {team.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Location:</span>{" "}
                            {team.area}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Created by:</span>{" "}
                            {team.creator?.name || "Unknown"}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {team.members?.length || 0} members
                        </span>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Team Members:
                        </h4>
                        {team.members?.length > 0 ? (
                          <ul className="space-y-2">
                            {team.members.map((member) => (
                              <li
                                key={member._id}
                                className="flex items-center"
                              >
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                                  {member.name.charAt(0)}
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {member.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {member.email}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            No members yet
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Upload Rescue Operation Image
            </h2>
            <form onSubmit={handleImageUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rescue Image
                </label>
                <div className="mt-1 flex items-center">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {image ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="h-20 object-contain rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setImage(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="w-8 h-8 mb-2 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG (MAX. 5MB)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="caption"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Caption
                </label>
                <textarea
                  id="caption"
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe the rescue operation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUploading || !image}
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    isUploading || !image
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    "Upload Image"
                  )}
                </button>
              </div>

              {uploadMessage && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    uploadMessage.includes("success")
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {uploadMessage}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default MyTeam;