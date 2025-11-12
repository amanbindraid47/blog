import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../config";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSignupButtonPressed } = location.state || {};
  const isDark = useSelector((state) => state.theme.isDarkmode);

  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
  const [isSignup, setIsSignup] = useState(isSignupButtonPressed || false);

  useEffect(() => {
    setIsSignup(!!isSignupButtonPressed);
  }, [isSignupButtonPressed]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendRequest = async (type = "login") => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/users/${type}`, {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });
      return res.data;
    } catch (err) {
      console.error("Error in sendRequest:", err);
      throw err;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      sendRequest("signup")
        .then((data) => {
          localStorage.setItem("userId", data.data.user._id);
          dispatch(authActions.login());
          navigate("/blogs");
        })
        .catch((err) => alert("Signup failed: " + (err.response?.data?.message || err.message)));
    } else {
      sendRequest()
        .then((data) => {
          localStorage.setItem("userId", data.data.user._id);
          dispatch(authActions.login());
          navigate("/blogs");
        })
        .catch((err) => alert("Login failed: " + (err.response?.data?.message || err.message)));
    }
  };

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-transparent' : ''}`}>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#071025] shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold">{isSignup ? 'Create account' : 'Welcome back'}</h2>
            <p className="text-sm text-white/90 mt-1">{isSignup ? 'Fill the details to create a new account.' : 'Login to continue to BlogsApp.'}</p>
          </div>

          <div className="p-8 sm:p-10 space-y-6">
            {isSignup && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  name="name"
                  onChange={handleChange}
                  value={inputs.name}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Your full name"
                  required
                />
              </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  name="email"
                  onChange={handleChange}
                  value={inputs.email}
                  type="email"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="you@example.com"
                  required
                />
              </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                name="password"
                onChange={handleChange}
                value={inputs.password}
                type="password"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter password"
                required
              />
            </div>


            <div className="flex items-center justify-between gap-4">
              <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-[1.02] transition-transform">
                {isSignup ? 'Sign up' : 'Sign in'}
              </button>

              <button type="button" onClick={() => setIsSignup(!isSignup)} className="text-sm text-gray-600 dark:text-gray-300 underline">
                {isSignup ? 'Have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
