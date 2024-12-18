import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogPage from './assets/BlogPage';
import Login from './assets/Login'
import Register from './assets/Register'
import './App.css'
import UserDashboard from './assets/UserDashboard';
import HomePage from './assets/HomePage';
function App() {

  return (
    <Router>
    <Routes>
    <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/blogs" element={<BlogPage />} />
      <Route path="/dashboard" element={<UserDashboard />} />

    </Routes>
  </Router>
  )
}

export default App
