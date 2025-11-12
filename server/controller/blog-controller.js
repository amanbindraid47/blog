import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate("user");
    console.log("getAllBlogs - Found blogs:", blogs.length);
    return res.status(200).json(new ApiResponse(200, { blogs }, "Blogs found"));
  } catch (e) {
    console.error("Error in getAllBlogs:", e);
    return res.status(500).json(new ApiError(500, e.message));
  }
};

const addBlog = async (req, res, next) => {
  const { title, desc, img, user } = req.body;
  const currentDate = new Date();

  try {
    console.log("Adding blog with data:", { title, desc, img, user });
    
    const existingUser = await User.findById(user);
    if (!existingUser) {
      console.log("User not found:", user);
      return res.status(400).json(new ApiError(400, "Unauthorized"));
    }

    const blog = new Blog({ title, desc, img, user, date: currentDate });
    
    // Save blog first
    await blog.save();
    
    // Then update user with blog reference
    existingUser.blogs.push(blog._id);
    await existingUser.save();

    console.log("Blog created successfully:", blog);
    return res.status(201).json(new ApiResponse(201, { blog }, "Blog created successfully"));
  } catch (e) {
    console.error("Error in addBlog:", e);
    return res.status(500).json(new ApiError(500, e.message));
  }
};

const updateBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const { title, desc } = req.body;

  try {
    const blog = await Blog.findByIdAndUpdate(blogId, { title, desc }, { new: true });
    if (!blog) {
      return res.status(404).json(new ApiError(404, "Blog not found"));
    }
    return res.status(200).json(new ApiResponse(200, { blog }, "Blog updated successfully"));
  } catch (e) {
    return res.status(500).json(new ApiError(500, e.message));
  }
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findById(id).populate("user");
    if (!blog) {
      return res.status(404).json(new ApiError(404, "Blog not found"));
    }
    return res.status(200).json(new ApiResponse(200, { blog }, "Blog retrieved successfully"));
  } catch (e) {
    return res.status(500).json(new ApiError(500, e.message));
  }
};

const deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findByIdAndDelete(id).populate('user');
    if (!blog) {
      return res.status(404).json(new ApiError(404, "Blog not found"));
    }

    const user = blog.user;
    user.blogs.pull(blog);
    await user.save();

    return res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully"));
  } catch (e) {
    return res.status(500).json(new ApiError(500, e.message));
  }
};

const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  try {
    console.log("getByUserId - Getting blogs for user:", userId);
    const userBlogs = await User.findById(userId).populate("blogs");
    if (!userBlogs) {
      console.log("User not found:", userId);
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    console.log("getByUserId - Found user with", userBlogs.blogs?.length || 0, "blogs");
    return res.status(200).json(new ApiResponse(200, { user: userBlogs }, "Blogs retrieved successfully"));
  } catch (e) {
    console.error("Error in getByUserId:", e);
    return res.status(500).json(new ApiError(500, e.message));
  }
};

export { getAllBlogs, addBlog, updateBlog, getById, deleteBlog, getByUserId };