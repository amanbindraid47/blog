/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog";
import config from "../config";

const UserBlogs = () => {
  const [user, setUser] = useState();
  const id = localStorage.getItem("userId");

  const sendRequest = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}/api/blogs/user/${id}`);
      const apiResponse = res.data;
      console.log("User blogs API response:", apiResponse);
      // ApiResponse structure: { statusCode, data: { user }, message, success }
      const user = apiResponse.data?.user || { blogs: [] };
      console.log("Extracted user:", user);
      return { user };
    } catch (err) {
      console.error("Error fetching user blogs:", err);
      return { user: { blogs: [] } };
    }
  };

  useEffect(() => {
    sendRequest().then((data) => setUser(data?.user));
  }, []);

  const handleDelete = (blogId) => {
    axios
      .delete(`${config.BASE_URL}/api/blogs/${blogId}`)
      .then(() => {
        console.log("Blog deleted, refreshing user blogs");
        sendRequest().then((data) => setUser(data.user));
      })
      .catch((err) => {
        console.error("Error deleting blog:", err);
        alert("Error deleting blog: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            My Blogs
          </h1>
          <p className="text-gray-600 text-lg">Manage your amazing stories</p>
          {user && user.blogs && user.blogs.length > 0 && (
            <div className="mt-4 flex justify-center gap-4">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                ✍️ {user.blogs.length} {user.blogs.length === 1 ? 'Blog' : 'Blogs'}
              </span>
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                👤 {user.name}
              </span>
            </div>
          )}
        </div>

        {/* Blogs Grid */}
        {user && user.blogs && user.blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {user.blogs.map((blog, index) => (
              <Blog
                key={blog._id}
                id={blog._id}
                isUser={true}
                title={blog.title}
                desc={blog.desc}
                img={blog.img}
                user={user.name}
                date={new Date(blog.date).toLocaleDateString()}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-6">
                <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">You Haven't Written Anything Yet</h2>
              <p className="text-gray-600 text-lg mb-6">Start sharing your thoughts and ideas with the world!</p>
              <a 
                href="/blogs/add" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                ✍️ Create Your First Blog
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default UserBlogs;
