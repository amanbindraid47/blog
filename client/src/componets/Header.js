import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authActions, setDarkmode } from "../store";
import { useDispatch, useSelector } from "react-redux";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const Header = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDarkmode);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [value, setValue] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTab = localStorage.getItem("selectedTab");
    const savedTheme = localStorage.getItem("isDarkMode");
    if (savedTab !== null) {
      setValue(parseInt(savedTab, 10));
    }
    if (savedTheme !== null) {
      dispatch(setDarkmode(JSON.parse(savedTheme))); 
    }
  }, []);
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/blogs/add")) {
      setValue(2);
    } else if (path.startsWith("/myBlogs")) {
      setValue(1);
    } else if (path.startsWith("/blogs")) {
      setValue(0);
    } else {
      setValue(0); 
    }
  }, [location.pathname]);

  const handleTabChange = (e, newValue) => {
    setValue(newValue);
    localStorage.setItem("selectedTab", newValue); 
  };

  const handleDarkModeToggle = () => {
    const newTheme = !isDark;
    localStorage.setItem("isDarkMode", newTheme); 
    dispatch(setDarkmode(newTheme)); 
  }

  const handleLoginClick = () => {
    navigate("/login", { state: { isSignupButtonPressed: false } });
  };

  const handleSignupClick = () => {
    navigate("/login", { state: { isSignupButtonPressed: true } });
  };

  return (
    <header
      className={`sticky top-0 z-30 backdrop-blur-sm bg-white/75 border-b ${
        isDark ? "bg-slate-800/75" : "bg-white/75"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 text-gray-900 dark:text-white">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex flex-col items-center justify-center text-white font-bold shadow">
                <span className="text-[13px] leading-none">Blog</span>
                <span className="text-[1px] leading-none">App</span>
              </div>
              <div className="hidden sm:block">
                
                <p className="text-xs text-gray-500">Share your stories</p>
              </div>
            </Link>
          </div>

          {/* Center - Nav (visible when logged in) */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={(e) => { handleTabChange(e, 0); navigate('/blogs'); }}
                className={`text-sm font-medium ${value === 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600' : 'text-gray-700 hover:text-gray-900'}`}>
                All Blogs
              </button>
              <button
                onClick={(e) => { handleTabChange(e, 1); navigate('/myBlogs'); }}
                className={`text-sm font-medium ${value === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600' : 'text-gray-700 hover:text-gray-900'}`}>
                My Blogs
              </button>
              <button
                onClick={(e) => { handleTabChange(e, 2); navigate('/blogs/add'); }}
                className={`text-sm font-medium ${value === 2 ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg shadow-md' : 'text-gray-700 hover:text-gray-900'}`}>
                Add Blog
              </button>
            </nav>
          )}

          {/* Right - Actions */}
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <button onClick={handleLoginClick} className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
                  Login
                </button>
                <button onClick={handleSignupClick} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-semibold shadow">
                  Sign up
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => dispatch(authActions.logout())}
                  className="px-4 py-2 bg-amber-400 text-black rounded-lg text-sm font-semibold shadow"
                >
                  Logout
                </button>
              </>
            )}

            <button
              onClick={handleDarkModeToggle}
              aria-label="Toggle theme"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {isDark ? <LightModeIcon className="text-yellow-300"/> : <DarkModeIcon className="text-gray-600"/>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
