import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const signup = async (userData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error;
  }
};



export const login = async ({ email, password }) => {
  try {
    console.log("🔍 Sending login request with:", { email, password });

    const response = await axios.post(
      `${API_URL}/login`,
      { email, password }, 
      { headers: { "Content-Type": "application/json" } } // Explicitly set JSON
    );

    console.log("✅ Login Successful:", response.data);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("❌ Login error:", error.response?.data || error.message);

    
    throw new Error(error.response?.data.error || "Login failed. Please try again.");
  }
};

// Logout function
export const logout = () => {
  console.log("🔴 Logging out...");
  localStorage.removeItem("token");
};