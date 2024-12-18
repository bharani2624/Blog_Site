import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const history=useNavigate();
  const dashboard=()=>
    {
      history('/dashboard')
    }
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:8081/blogs");
      setBlogs(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen rounded shadow-md">
      <header className="relative py-4 bg-blue-500">
        <h1 className="text-3xl font-bold text-center text-white">All Blogs</h1>
        <button
          onClick={dashboard}
          className="absolute top-4 right-6 bg-white text-blue-500 font-bold py-2 px-4 rounded-lg shadow hover:bg-gray-100"
        >
          Dashboard
        </button>
      </header>
      <div className="container mx-auto p-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800">{blog.title}</h2>
            <p className="text-gray-600">{blog.content}</p>
            {/* <p className="mt-2 text-sm text-gray-500">Author: {blog.user_id}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
