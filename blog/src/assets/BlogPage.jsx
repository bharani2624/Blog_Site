import React, { useState, useEffect } from "react";
import axios from "axios";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  const userId = 1; // Replace with dynamic user ID from login or JWT

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
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
      fetchBlogs();
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
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Blog Page</h1>
      <form onSubmit={handleCreateOrUpdate}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button type="submit">{editId ? "Update" : "Create"} Blog</button>
      </form>
      <div>
        {blogs.map((blog) => (
          <div key={blog.id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <button onClick={() => handleEdit(blog)}>Edit</button>
            <button onClick={() => handleDelete(blog.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
