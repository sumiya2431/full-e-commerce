import { useState, useContext } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/store";
import "../styles/Auth.css"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("⚠ Email and password are required!");
      return;
    }

    try {
      const data = await login(formData);
      localStorage.setItem("token", data.token);
      authCtx.setToken(data.token);
      alert("✅ Login successful!");
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data.error || "❌ Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>🔑 Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="📧 Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="🔒 Password" value={formData.password} onChange={handleChange} required />
          <button type="submit">🔓 Login</button>
        </form>
        <a href="/signup">📝 Don't have an account? Sign Up</a>
      </div>
    </div>
  );
};

export default Login;










