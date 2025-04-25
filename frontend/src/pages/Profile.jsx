import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showAddPoints, setShowAddPoints] = useState(false);
  const [bkashNumber, setBkashNumber] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/api/user/profile", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user data");
        }

        const data = await response.json();
        const { name, email, location, bio, role, points } = data.user;
        setUser(data.user);
        setFormData({
          name,
          email,
          location: location || "Not Selected Yet",
          bio: bio || "",
          role: role,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:4000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      setUser(data);
      setSuccess(true);
      setEditMode(false);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      location: user.location || "",
      bio: user.bio || "",
      role: user.role,
    });
    setEditMode(false);
    setError(null);
  };

  const handleLoadPoints = async () => {
    try {
      setLoading(true);
      setError(null);
  
      if (!bkashNumber || !amount) {
        setError("Please fill all fields");
        return;
      }
  
      const response = await fetch("http://localhost:4000/api/user/add-points", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bkashNumber, amount }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add points");
      }
  
      const data = await response.json();
      setUser(data.user); // Update the user with new points
  
      setBkashNumber("");
      setAmount("");
      setSuccess(true);
  
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  

  if (loading && !user) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center p-4 text-red-500">
        {error || "User not found"}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-1/4 bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold mb-6">Settings</h2>
          <ul className="space-y-4 text-gray-700">
            <li
              className={`font-semibold cursor-pointer ${
                !showAddPoints ? "text-blue-600" : ""
              }`}
              onClick={() => setShowAddPoints(false)}
            >
              Account Information
            </li>
            <li
              className={`cursor-pointer ${
                showAddPoints ? "text-blue-600 font-semibold" : ""
              }`}
              onClick={() => setShowAddPoints(true)}
            >
              Add Points
            </li>
          </ul>
        </div>

        <div className="w-3/4 p-10">
          <div className="bg-white p-8 rounded-xl shadow-md">
            {showAddPoints ? (
              <div>
                <h1 className="text-2xl font-bold mb-6">Add Points</h1>

                {error && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                    Points added successfully!
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Bkash Number
                    </label>
                    <input
                      type="text"
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your Bkash number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleLoadPoints}
                      disabled={loading}
                      className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Load Points"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-6">User Details</h1>

                {error && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                    Profile updated successfully!
                  </div>
                )}

                <div className="flex items-center space-x-6 mb-6">
                  <img
                    src="profilePhoto.jpeg"
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <button className="block mb-2 text-sm font-semibold text-blue-600 hover:underline">
                      Change
                    </button>
                    <button className="block text-sm font-semibold text-red-600 hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Form */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 border rounded-md disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 border rounded-md disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 border rounded-md disabled:bg-gray-100"
                >
                  <option value="Gulshan">Gulshan</option>
                  <option value="Badda">Badda</option>
                  <option value="Mirpur">Mirpur</option>
                  <option value="Uttara">Uttara</option>
                  <option value="Banani">Banani</option>
                  <option value="Dhanmondi">Dhanmondi</option>
                  <option value="Mohammadpur">Mohammadpur</option>
                  <option value="Puran Dhaka">Puran Dhaka</option>
                  <option value="Moghbazar">Moghbazar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 border rounded-md disabled:bg-gray-100"
                >
                  <option value="donor">Donor</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!editMode}
                  rows={4}
                  className="w-full p-2 border rounded-md disabled:bg-gray-100"
                />
              </div>

              {user.points !== undefined && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Points
                  </label>
                  <div className="p-2 w-full bg-gray-100 rounded-md">
                    {user.points}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              {editMode ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
