import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

const Blog = ({ title, desc, img, user, isUser, id }) => {
  const navigate = useNavigate();
  
  const handleEdit = () => {
    navigate(`/myBlogs/${id}`);
  };
  
  const deleteRequest = async () => {
    try {
      const res = await axios.delete(`${config.BASE_URL}/api/blogs/${id}`);
      const data = res.data;
      console.log("Blog deleted:", data);
      return data;
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Error deleting blog: " + (err.response?.data?.message || err.message));
      throw err;
    }
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      deleteRequest()
        .then(() => navigate("/"))
        .then(() => navigate("/blogs"));
    }
  };
  
  // Get first letter of user name for avatar
  const avatarLetter = user ? user.charAt(0).toUpperCase() : "?";
  
  // Extract first 150 characters of description
  const truncatedDesc = desc.length > 150 ? desc.substring(0, 150) + "..." : desc;
  
  const [imageError, setImageError] = useState(false);
  const imageSrc = img && img.trim() !== "" ? img : "https://via.placeholder.com/800x400?text=No+Image";
  // If the image URL is already proxied or points to our backend/origin, use it as-is.
  // Otherwise route the request through the server image proxy so external images
  // are fetched by the backend (avoids CORS/hotlink issues and mixed-origin problems).
  const isAlreadyProxied =
    imageSrc.startsWith("/images/proxy") ||
    imageSrc.startsWith(window.location.origin) ||
    imageSrc.startsWith(config.BASE_URL) ||
    imageSrc.startsWith("http://") ||
    imageSrc.startsWith("https://");

  // Prefer using the backend proxy for external URLs to ensure consistent loading.
  const proxiedSrc = isAlreadyProxied && !imageSrc.startsWith("http")
    ? imageSrc
    : `${config.BASE_URL}/images/proxy?url=${encodeURIComponent(imageSrc)}`;

  return (
    <div className="group h-full">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden h-56 sm:h-48 md:h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <img
            src={proxiedSrc}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              console.error("Image failed to load:", imageSrc);
              setImageError(true);
              e.target.src = "https://via.placeholder.com/800x400?text=No+Image";
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {/* Debug: show image URL when it fails (visible for troubleshooting) */}
        {imageError && (
          <div className="p-3 bg-yellow-50 text-xs text-yellow-800 border-l-4 border-yellow-300">
            <strong>Image load failed.</strong>
            <div className="break-words">Source: {imageSrc}</div>
          </div>
        )}

        {/* Content */}
        <div className="p-5 flex-grow flex flex-col">
          {/* Header with user info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                {avatarLetter}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{user}</p>
                <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* Edit and Delete buttons - positioned on the right */}
            {isUser && (
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={handleEdit}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                  title="Edit blog"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                  title="Delete blog"
                >
                  <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 6h18v2H3V6zm0 3h1v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9h1V7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H3v3zm5 12H8V10h2v11zm4 0h-2V10h2v11zm4 0h-2V10h2v11zm-10-13V4h8v3H7z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => navigate(`/blogs/${id}`)}
            className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors"
            role="button"
            aria-label={`Read ${title}`}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {truncatedDesc}
          </p>

          {/* Read More Button */}
          <button
            onClick={() => navigate(`/blogs/${id}`)}
            className="w-full mt-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-black font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Read More →
          </button>
        </div>
      </div>
    </div>
  );
};


export default Blog;
