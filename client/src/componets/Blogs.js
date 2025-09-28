import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog";
import config from "../config";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const sendRequest = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}/api/blogs`);
      return res.data; 
    } catch (err) {
      console.error("API Error:", err.message);
      return { blogs: [] }; 
    }
  };

  useEffect(() => {
    sendRequest().then((data) => {
      if (data && data.blogs) {
        setBlogs(data.blogs);
      } else {
        setBlogs([]);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Loading blogs...</p>;
  }

  return (
    <div>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <Blog
            key={blog._id}
            id={blog._id}
            isUser={localStorage.getItem("userId") === blog.user?._id}
            title={blog.title}
            desc={blog.desc}
            img={blog.img}
            user={blog.user?.name || "Unknown User"}
            date={
              blog.date ? new Date(blog.date).toLocaleDateString() : "N/A"
            }
          />
        ))
      ) : (
        <p>No blogs found.</p>
      )}
    </div>
  );
};

export default Blogs;
