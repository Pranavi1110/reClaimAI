import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getRoleFromEmail = (email) => {
    if (email === 'rasagnakudikyala@gmail.com') return 'admin';
    if (email.endsWith('@partner')) return 'partner';
    return 'user';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const role = getRoleFromEmail(formData.email);
    const fullData = {
      name: formData.username,
      email: formData.email,
      password: formData.password,
      role,
    };

    try {
      const checkResponse = await axios.get(
        `http://localhost:5000/user-api/check-email?email=${formData.email}`
      );

      if (checkResponse.data.exists) {
        console.log('User already exists. Logging in...');
        // You can validate password here if needed
      } else {
        await axios.post('http://localhost:5000/user-api/register', fullData);
        console.log('New user created.');
      }

      // Set login state
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);

      // Navigate based on role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'partner') {
        navigate('/partner');
      } else {
        navigate('/return');
      }
    } catch (err) {
      console.error('Error during login/register:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
