import { useState, useEffect } from "react";
import Profil from "./bglogin.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");
  const [navigateRoute, setNavigateRoute] = useState("");
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { username, password });

      const { accessToken } = response.data;
      const decoded = jwtDecode(accessToken);
      const userRole = decoded.role.toLowerCase();

      localStorage.setItem("accessToken", accessToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      switch (userRole) {
        case "admin":
          setNavigateRoute("/dashboard");
          break;

        default:
          setMsg("Akun tidak dikenali.");
          break;
      }
    } catch (error) {
      if (error.response) {
        console.log("Error response:", error.response.data);
        setMsg(error.response.data.msg);
      } else {
        console.error("Error:", error.message);
        setMsg("Login gagal, silakan coba lagi.");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded = jwtDecode(token);
      const userRole = decoded.role.toLowerCase();

      switch (userRole) {
        case "admin":
          navigate("/dashboard");
          break;
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (navigateRoute) {
      navigate(navigateRoute);
    }
  }, [navigateRoute, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${Profil})` }}>
    <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="w-full max-w-md p-10 bg-white bg-opacity-0 backdrop-blur-lg shadow-2xl rounded-lg transition-transform transform hover:scale-105">
        <h1 className="text-3xl font-extrabold text-center text-indigo-600 mb-2">
          JurnalPolri Admin
        </h1>
        <p className="mb-4 text-center text-gray-700 font-medium text-lg">
          Masukan Username dan Password Anda!
        </p>
  
        {msg && <p className="mb-4 text-center text-red-500">{msg}</p>}
  
        <form onSubmit={Auth} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukan username Anda"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
  
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*******"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
  
          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>
  
          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 text-white text-lg font-semibold rounded-lg shadow-lg bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default Login;
