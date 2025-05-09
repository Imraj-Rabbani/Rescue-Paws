import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    backendUrl,
    checkAuthStatus,
    showCartRestorePrompt,
    restoreCartFromLocal,
    discardLocalCart,
  } = useContext(AppContext);

  const redirectPath = location.state?.from || "/";

  const [state, setState] = useState("Sign Up");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const toggleAuth = () => {
    setState((prevState) => (prevState === "Sign Up" ? "Login" : "Sign Up"));
    setLoginError("");
    setRegisterError("");
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleAuthSubmit = async (e, type) => {
    try {
      e.preventDefault();
  
      axios.defaults.withCredentials = true; // 🔐 Ensure cookies are sent
  
      let payload = {};
      let endpoint = "";
  
      if (type === "Login") {
        const { email, password } = loginData;
        if (!email || !password) {
          toast.error("Please enter both email and password.");
          return;
        }
        payload = { email, password };
        endpoint = "/api/auth/login";
      } else if (type === "Sign Up") {
        const { name, email, password, confirmPassword } = registerData;
        if (!name || !email || !password || !confirmPassword) {
          toast.error("Please enter all the details.");
          return;
        }
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        payload = { name, email, password };
        endpoint = "/api/auth/register";
      }
  
      const response = await axios.post(backendUrl + endpoint, payload);
  
      if (response.data.success) {
        toast.success(`${type} successful!`);
  
        // ✅ Save user info to localStorage (used in AdminRoute)
        if (type === "Login" && response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
  
        // ✅ Clear form data
        if (type === "Login") {
          setLoginData({ email: "", password: "" });
        } else {
          setRegisterData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }
  
        // ✅ Check status and navigate
        await checkAuthStatus();
        navigate(redirectPath, { replace: true });
  
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "An unexpected error occurred.";
      toast.error(message);
      console.error(`${type} Error:`, error);
    }
  };
  

  const handleLoginSubmit = (e) => handleAuthSubmit(e, "Login");
  const handleRegisterSubmit = (e) => handleAuthSubmit(e, "Sign Up");

  return (
    <div className="min-h-screen flex items-center justify-center py-6 bg-[url('new_background.png')] bg-cover bg-center relative">
      {showCartRestorePrompt && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-xl border p-5 rounded-xl z-50 w-96 text-center">
          <p className="font-medium mb-4 text-lg">🛒 Restore your previous cart?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={restoreCartFromLocal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Yes
            </button>
            <button
              onClick={discardLocalCart}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            >
              No
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <div className="header mb-8 text-center">
          <a href="http://localhost:5173/">
            <img src="/logo_new.png" alt="Logo" className="h-[200px] mx-auto" />
          </a>
          <p className="mt-2 text-xl text-gray-600">
            {state === "Sign Up" ? "Join our community" : "Welcome back"}
          </p>
        </div>

        {state === "Login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {loginError && <p className="text-red-500 text-sm italic">{loginError}</p>}
            <div>
              <label htmlFor="loginEmail" className="block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <input
                type="email"
                id="loginEmail"
                name="email"
                value={loginData.email}
                onChange={handleLoginInputChange}
                required
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="loginPassword" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="loginPassword"
                name="password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                required
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log In
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={toggleAuth}
                className="font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none"
              >
                Sign Up
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            {registerError && <p className="text-red-500 text-sm italic">{registerError}</p>}
            <div>
              <label htmlFor="registerName" className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="registerName"
                name="name"
                value={registerData.name}
                onChange={handleRegisterInputChange}
                required
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="registerEmail" className="block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <input
                type="email"
                id="registerEmail"
                name="email"
                value={registerData.email}
                onChange={handleRegisterInputChange}
                required
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="registerPassword" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="registerPassword"
                name="password"
                value={registerData.password}
                onChange={handleRegisterInputChange}
                required
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleRegisterInputChange}
                required
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={toggleAuth}
                className="font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none"
              >
                Log In
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
