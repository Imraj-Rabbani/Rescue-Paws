import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTeamPage = () => {
  const [teamName, setTeamName] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/teams/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ teamName, location }),
      });

      if (!res.ok) {
        throw new Error("Failed to create team");
      }

      const data = await res.json();
      console.log("Team created:", data);

      navigate("/volunteers"); // navigate after success
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded-xl shadow"
    >
      <h2 className="text-xl font-bold mb-4">Create a Team</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Team Name</label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-2 border rounded-xl focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded-xl focus:outline-none focus:ring focus:ring-blue-400"
          required
        >
          <option value="" disabled>
            Select a location
          </option>
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

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Create Team
      </button>
    </form>
  );
};

export default CreateTeamPage;
