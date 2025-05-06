import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const VolunteerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [rescueImages, setRescueImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [bkashNumber, setBkashNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [donationError, setDonationError] = useState("");
  const [donationSuccess, setDonationSuccess] = useState("");

  useEffect(() => {
    const fetchVolunteerProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/api/volunteers/${id}?page=${currentPage}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            navigate("/not-found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setProfile(data.volunteer);
        setRescueImages(data.rescueImages);
        setTotalPages(data.totalPages);
        setError("");
      } catch (err) {
        console.error("Error fetching volunteer profile:", err);
        setError("Failed to load volunteer profile");
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerProfile();
  }, [id, currentPage, navigate]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-5">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-8 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Volunteer Profile Card */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex flex-col items-center">
                <img
                  src="/profilePhoto.jpeg"
                  alt={profile.name}
                  className="rounded-full w-36 h-36 object-cover border-4 border-white shadow-md mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-800">
                  {profile.name}
                </h2>
                <p className="text-gray-500 mb-4">{profile.location}</p>

                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    Balance: {profile.points}
                  </span>
                </div>

                <p className="text-gray-600 text-center mb-6 whitespace-pre-line">
                  {profile.bio || "This volunteer hasn't written a bio yet."}
                </p>

                <button
                  onClick={() => setShowDonateForm(!showDonateForm)}
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Donate
                </button>

                {showDonateForm && (
                  <div className="w-full mt-4">
                    <div className="bg-gray-50 p-4 rounded shadow">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Bkash Number
                        </label>
                        <input
                          type="text"
                          value={bkashNumber}
                          onChange={(e) => setBkashNumber(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="01XXXXXXXXX"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Amount
                        </label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter amount"
                        />
                      </div>
                      {donationError && (
                        <p className="text-red-500 text-sm">{donationError}</p>
                      )}
                      {donationSuccess && (
                        <p className="text-green-500 text-sm">
                          {donationSuccess}
                        </p>
                      )}
                      <button
                        onClick={async () => {
                          setDonationError("");
                          setDonationSuccess("");
                          if (!bkashNumber || !amount) {
                            setDonationError("All fields are required.");
                            return;
                          }

                          try {
                            const response = await fetch(
                              `http://localhost:4000/api/volunteers/${id}/donate`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                credentials: "include",
                                body: JSON.stringify({
                                  bkashNumber,
                                  amount: Number(amount),
                                }),
                              }
                            );

                            if (!response.ok)
                              throw new Error("Failed to donate");

                            const result = await response.json();
                            setDonationSuccess("Donation successful!");
                            setBkashNumber("");
                            setAmount("");
                            setProfile((prev) => ({
                              ...prev,
                              points: prev.points + Number(amount),
                            }));
                          } catch (err) {
                            console.error(err);
                            setDonationError("Failed to process donation.");
                          }
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Donate Points
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rescue Images Section */}
          <div className="md:w-2/3">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Recent Rescues
            </h3>

            {rescueImages.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">No rescue images posted yet.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rescueImages.map((image) => (
                    <div
                      key={image._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {console.log(`http://localhost:4000/ ${image.imageUrl}`)}
                      <img
                        src={`http://localhost:4000${image.imageUrl}`}
                        alt="Rescued animal"
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <p className="text-gray-700">
                          {image.caption || "No caption provided"}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          {new Date(image.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center gap-1">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded border ${
                              currentPage === page
                                ? "bg-blue-500 text-white border-blue-500"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VolunteerProfile;
