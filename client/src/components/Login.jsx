import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login'
import axios from "axios";

function Login({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getRoleFromEmail = (email) => {
    if (email === "rasagnakudikyala@gmail.com") return "admin";
    if (email.endsWith("@partner")) return "partner";
    return "user";
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
        // Fetch user details for localStorage
        const userRes = await axios.get(
          `http://localhost:5000/user-api/check-email?email=${formData.email}`
        );
        localStorage.setItem("user", JSON.stringify({ email: formData.email }));
      } else {
        const registerRes = await axios.post(
          "http://localhost:5000/user-api/register",
          fullData
        );
        localStorage.setItem("user", JSON.stringify({ email: formData.email }));
      }

      // Set login state
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);

      // Navigate based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "partner") {
        navigate("/partner");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      console.error("Error during login/register:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center  px-3" >
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-lg mt-5 w-25" style={{ maxWidth: "500px" ,background: "transparent"}}>
        <h2 className="text-center mb-4 fw-bold text-dark">Login</h2>

    <div className="mb-3">
      <label htmlFor="username" className="form-label text-start ">
        Username
      </label>
      <input
        type="text"
        className="form-control"
        id="username"
        name="username"
        placeholder="Enter your username"
        required
      />
    </div>

    <div className="mb-3">
      <label htmlFor="email" className="form-label text-start">
        Email
      </label>
      <input
        type="email"
        className="form-control"
        id="email"
        name="email"
        placeholder="Enter your email"
        required
      />
    </div>

    <div className="mb-4">
      <label htmlFor="password" className="form-label " style={{ textAlign: "start" }}>
        Password
      </label>
      <input
        type="password"
        className="form-control"
        id="password"
        name="password"
        placeholder="Enter your password"
        required
      />
    </div>

    <button type="submit" className="btn btn-success  fw-semibold">
      Submit
    </button>
  </form>
</div>
  );
}

export default Login;
