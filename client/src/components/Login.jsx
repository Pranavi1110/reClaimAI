import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login";
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
    if (email.endsWith("@ngo")) return "ngo";
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
    console.log("Form Data:", fullData);
    try {
      const checkResponse = await axios.get(
        `http://localhost:5000/user-api/check-email?email=${formData.email}`
      );

      if (checkResponse.data.exists) {
        // Fetch user details for localStorage
        const userRes = await axios.get(
          `http://localhost:5000/user-api/check-email?email=${formData.email}`
        );
        localStorage.setItem(
          "user",
          JSON.stringify({ email: formData.email, role })
        );
      } else {
        const registerRes = await axios.post(
          "http://localhost:5000/user-api/register",
          fullData
        );
        localStorage.setItem(
          "user",
          JSON.stringify({ email: formData.email, role })
        );
      }

      // Set login state
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);

      // Print login details
      console.log("Logged in:", { email: formData.email, role });

      // Navigate based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "partner") {
        navigate("/partner");
      } else {
        navigate("/"); // Redirect to home page for regular users
      }
    } catch (err) {
      console.error("Error during login/register:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center  px-3">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-lg mt-5 w-25"
        style={{ maxWidth: "500px", background: "transparent" }}
      >
        <h2 className="text-center mb-4 fw-bold text-dark">Login</h2>

        <div className="mb-3">
          <label htmlFor="username" className="form-label text-start ">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label text-start">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="
            form-control"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="form-label "
            style={{ textAlign: "start" }}
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
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
