import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import config from "../config";

const BlogView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  // image hook must be declared unconditionally (hooks cannot be called after early returns)
  const [imageError, setImageError] = useState(false);
  const imageSrc = blog?.img && blog.img.trim() !== "" ? blog.img : "https://via.placeholder.com/1200x500?text=Blog+Image";
  // Route image requests through the backend proxy (using configured BASE_URL)
  // so external image URLs are fetched server-side and returned to the client.
  const isAlreadyProxied =
    imageSrc.startsWith("/images/proxy") ||
    imageSrc.startsWith(window.location.origin) ||
    imageSrc.startsWith(config.BASE_URL) ||
    imageSrc.startsWith("http://") ||
    imageSrc.startsWith("https://");

  const proxiedSrc = isAlreadyProxied && !imageSrc.startsWith("http")
    ? imageSrc
    : `${config.BASE_URL}/images/proxy?url=${encodeURIComponent(imageSrc)}`;

  const fetchBlogDetails = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}/api/blogs/${id}`);
      const apiResponse = res.data;
      console.log("Blog detail API response:", apiResponse);
      const blog = apiResponse.data?.blog;
      setBlog(blog);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch blog details:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-6 animate-pulse">
            <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Loading blog...</h2>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-full mb-6">
            <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/blogs")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            ← Back to All Blogs
          </button>
        </div>
      </div>
    );
  }

  // Get first letter of user name for avatar
  const avatarLetter = blog?.user?.name ? blog.user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Floating Back Button */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Blogs
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Featured Image with Overlay */}
          <div className="relative w-full h-80 sm:h-96 md:h-[28rem] rounded-3xl overflow-hidden shadow-2xl mb-8 group bg-gray-100 flex items-center justify-center">
            <img
              src={proxiedSrc}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                console.error("BlogView image failed to load:", imageSrc);
                setImageError(true);
                e.target.src = "https://via.placeholder.com/1200x500?text=Blog+Image";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Image Badge */}
            <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-semibold text-gray-900">Featured</span>
            </div>
          </div>
          {imageError && (
            <div className="mt-4 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-300">
              Image failed to load. Source: <span className="break-words font-mono">{imageSrc}</span>
            </div>
          )}

          {/* Content Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Author Section with Gradient Background */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 sm:p-10 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg border-2 border-white/30">
                  {avatarLetter}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-2xl font-bold mb-1">{blog.user?.name || "Anonymous"}</h3>
                  <p className="text-white/80 text-sm sm:text-base">
                    {new Date(blog.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      weekday: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="px-8 sm:px-12 pt-10 sm:pt-14 pb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                {blog.title}
              </h1>
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  Blog Post
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                  {blog.desc?.split(' ').length || 0} words
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-8 sm:px-12 py-10">
              <div className="prose prose-lg max-w-none">
                  <p className="text-gray-800 text-base sm:text-lg leading-8 whitespace-pre-wrap font-medium">
                    {blog.desc}
                  </p>
                </div>

              {/* Read Time Indicator */}
              <div className="mt-10 pt-8 border-t-2 border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Reading Time</p>
                  <p className="text-gray-900 font-semibold text-lg">
                    {Math.ceil((blog.desc?.split(' ').length || 0) / 200)} min read
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <button
                    onClick={() => navigate("/blogs")}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Explore More Blogs
                  </button>
                </div>
              </div>
            </div>

            {/* Footer with Blog ID */}
            <div className="px-8 sm:px-12 py-6 bg-gray-50 border-t border-gray-200">
              <p className="text-gray-500 text-xs sm:text-sm font-mono">
                ID: <span className="text-gray-700 font-semibold">{blog._id}</span>
              </p>
            </div>
          </div>

          {/* end content */}
        </div>
      </div>
    </div>
  );
};

export default BlogView;
