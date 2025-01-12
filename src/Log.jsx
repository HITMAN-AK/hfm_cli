import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/log.css";

function Log() {
  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          role,
          username,
          password,
        }
      );
      sessionStorage.setItem("role", response.data.role);
      sessionStorage.setItem("username", response.data.username);
      if (response.data.role === "admin") {
        navigate("/admindashboard");
        window.location.reload();
      } else if (response.data.role === "pantry") {
        navigate("/pantrydashboard");
        window.location.reload();
      } else if (response.data.role === "delivery") {
        navigate("/deliverydashboard");
        window.location.reload();
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Server error. Please try later.");
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="unique-login-container">
      {isLoading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div className="unique-login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="unique-form-group">
              <label>Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="pantry">Pantry</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            <div className="unique-form-group">
              <label>Username or Email:</label>
              <input
                type="text"
                placeholder="Enter Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="unique-form-group">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="unique-error-message">{error}</p>}

            <button type="submit" className="unique-btn-login">
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Log;
