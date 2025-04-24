import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn, userData, backendUrl } =
    useContext(AppContext);
  // console.log(userData);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setIsLoggedIn(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-white shadow-md p-2">
      <div 
        className="cursor-pointer" 
        onClick={() => navigate("/")}
      >
      <img src="/logo_new.png" alt="STRAY PAWS" className=" ml-4 w-[100px]" />
      </div>

      <ul className="flex gap-6">
        <li>
          <a href="#" className="hover:underline" onClick={() => navigate("/")}>
            Home
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline" onClick={() => navigate("/")}>
            Teams
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline" onClick={() => navigate("/")}>
            Rescues
          </a>
        </li>
        <li>
          <a
            href="#"
            className="hover:underline"
            onClick={() => navigate("/products")}
          >
            Products
          </a>
        </li>
        {isLoggedIn && (
          <li>
            <a
              href="#"
              className="hover:underline"
              onClick={() => navigate("/")}
            >
              Analytics
            </a>
          </li>
        )}
      </ul>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-8">
              <span className="text-sm font-semibold">{userData.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold hover:underline"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold hover:underline"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold hover:underline"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
