  import axios from "axios";
import config from "../config";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import placeholderImg from "../placeholder.jpg";

const AddBlogs = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ title: "", description: "", imageURL: "" });

  const handleChange = (e) => {
    setInputs((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const sendRequest = async () => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/blogs/add`, {
        title: inputs.title,
        desc: inputs.description,
        img: inputs.imageURL.trim() === "" ? placeholderImg : inputs.imageURL,
        user: localStorage.getItem("userId"),
      });
      const data = res.data;
      console.log("Blog added successfully:", data);
      return data;
    } catch (err) {
      console.error("Error adding blog:", err);
      alert("Error adding blog: " + (err.response?.data?.message || err.message));
      throw err;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest()
      .then((data) => {
        console.log("Blog posted successfully", data);
        navigate("/blogs");
      })
      .catch((err) => {
        console.error("Failed to post blog:", err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Post Your Blog</h2>
            <p className="text-sm text-white/90 mt-1">Share your ideas with the world — add a title, content and an image URL.</p>
          </div>

          <div className="p-8 sm:p-10 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                name="title"
                onChange={handleChange}
                value={inputs.title}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Write a short, catchy title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                onChange={handleChange}
                value={inputs.description}
                rows={8}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Tell your story..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
              <input
                name="imageURL"
                onChange={handleChange}
                value={inputs.imageURL}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="https://example.com/photo.jpg (optional)"
              />
              <p className="text-xs text-gray-400 mt-2">If left blank a placeholder image will be used.</p>
            </div>

            <div className="flex items-center justify-end">
              <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-[1.02] transition-transform">
                Publish
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogs;
