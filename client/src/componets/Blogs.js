import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog";
import config from "../config";

const Blogs = () => {
  const [blogs, setBlogs] = useState();
  const [refresh, setRefresh] = useState(0);
  
  const sendRequest = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}/api/blogs`);
      const apiResponse = res.data;
      console.log("Blogs API response:", apiResponse);
      // ApiResponse structure: { statusCode, data: { blogs }, message, success }
      const blogs = apiResponse.data?.blogs || [];
      console.log("Extracted blogs:", blogs);
      return { blogs };
    } catch (err) {
      console.error("Error fetching blogs:", err);
      return { blogs: [] };
    }
  };
  
  useEffect(() => {
    sendRequest().then((data) => {
      console.log("Setting blogs:", data.blogs);
      setBlogs(data.blogs);
    });
  }, [refresh]);
  
  console.log(blogs);
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">All Blogs</h2>
          <p className="mt-2 text-gray-600">Explore latest posts from authors</p>
          {blogs && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                ✍️ {blogs.length} {blogs.length === 1 ? 'Blog' : 'Blogs'}
              </span>
            </div>
          )}
        </div>

        {/* Grid */}
        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog._id} className="h-full">
                <Blog
                  id={blog._id}
                  isUser={localStorage.getItem("userId") === String(blog.user._id)}
                  title={blog.title}
                  desc={blog.desc}
                  img={blog.img}
                  user={blog.user?.name}
                  date={new Date(blog.date).toLocaleDateString()}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No blogs yet</h3>
              <p className="text-gray-600">Be the first to publish a story.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
