import express from "express";
import { getAllBlogs, addBlog, updateBlog, getById, deleteBlog, getByUserId } from "../controller/blog-controller.js";

const blogRouter = express.Router();

blogRouter.get("/", getAllBlogs);
blogRouter.post('/add', addBlog);
blogRouter.get("/user/:id", getByUserId);
blogRouter.get("/:id", getById);
blogRouter.put("/update/:id", updateBlog);
blogRouter.delete("/:id", deleteBlog);

export default blogRouter;