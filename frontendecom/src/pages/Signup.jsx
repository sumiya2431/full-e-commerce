import { useState } from "react";
import { signup } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"; 

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
    address: "",
    phone_number: "",
    accessKey: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.error || "Signup failed");
    }
  };
 

  return (
    <div >
       
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <span>👤</span>         
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <span>📧</span>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <span>🔒</span>
          <input type="password" name="password" placeholder="Password (Min 6 characters)" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <span>🏠</span>
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        </div>

        <div className="input-group">
          <span>📞</span>
          <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
        </div>

        <div className="input-group">
          <span>🔽</span>
          <select name="role" onChange={handleChange} required>
            {/* <option value="">Select Role</option> */}
            <option value="User">👤 User</option>
            <option value="Admin">🛠 Admin</option>
          </select>
        </div>
        {formData.role === "Admin" && (
          <div className="input-group">
           <span>🔑</span>
           <input type="text" name="accessKey" placeholder="Admin Access Key" onChange={handleChange} required />
         </div>
          // <input type="text" name="accessKey" placeholder="Admin Access Key" onChange={handleChange} />
        )}
        <button type="submit">✅ Sign Up</button>
        {/* <button type="submit">Signup</button> */}
      </form>
    </div>
  );
};

export default Signup;
