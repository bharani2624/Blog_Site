import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const UserDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const history=useNavigate();
  const home=()=>
    {
      history('/')
    }

  const userId = 1;

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  const fetchUserBlogs = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/blogs/user/${userId}`);
      setBlogs(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:8081/blogs/${editId}`, { title, content });
      } else {
        await axios.post("http://localhost:8081/blogs", { title, content, user_id: userId });
      }
      setTitle("");
      setContent("");
      setEditId(null);
      fetchUserBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setEditId(blog.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/blogs/${id}`);
      fetchUserBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen ">
      <header className="py-4 bg-blue-400">
        <h1 className="text-3xl font-bold text-center text-white">My Blogs</h1>
        <button
          onClick={home}
          className="absolute top-12 left-10 bg-white text-blue-500 font-bold py-2 px-4 rounded-lg shadow hover:bg-gray-100"
        >
          Home
        </button>
      </header>
      <div className="container mx-auto p-6">
        <form onSubmit={handleCreateOrUpdate} className="mb-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800">
            {editId ? "Edit Blog" : "Create Blog"}
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 my-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 my-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {editId ? "Update" : "Post"}
          </button>
        </form>
        {blogs.map((blog) => (
          <div key={blog.id} className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800">{blog.title}</h2>
            <p className="text-gray-600">{blog.content}</p>
            <div className="mt-2">
              <button
                onClick={() => handleEdit(blog)}
                className="px-4 py-2 mr-2 font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-yellow-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog.id)}
                className="px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
