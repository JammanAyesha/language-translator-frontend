import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    // 🔥 IMPORTANT: remove old tokens
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    try {
      const response = await API.post("accounts/register/", {
        username,
        email,
        password,
      });

      console.log("Register Response:", response.data);

      // Save JWT tokens
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      alert("User registered & logged in!");
      navigate("/"); // Go to Translate page
    } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("RESPONSE DATA:", error.response?.data);
        alert(JSON.stringify(error.response?.data));
    }
  };

  return (
    <div className="container mt-4">
      <h4>Register</h4>

      <input
        className="form-control mb-2"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-success" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

export default RegisterPage;
