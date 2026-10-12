
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await API.post("/api/auth/login", {
        ...formData,
        role,
      });

      const data = response.data;
      const token = data.token || data.accessToken;
      const user = data.user || data;

      if (!token) {
        setMessage(
          "Login response did not include a token."
        );
        return;
      }

      // Verify the role returned by the backend.
      if (user.role && user.role !== role) {
        setMessage(
          "This account does not match the selected role."
        );
        return;
      }

      if (!user.role) {
        setMessage(
          "Your account role was not returned by the server. Please check the backend login route."
        );
        return;
      }

      login({
        ...user,
        token,
      });

      navigate(
        user.role === "chef"
          ? "/chef-dashboard"
          : "/"
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed. Please check your details and account type."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Welcome Back!</h1>
        <p>Log in to your RecipeHub account.</p>

        <label>Choose account type</label>

        <div className="role-selection">
          <button
            type="button"
            className={
              role === "user" ? "role-option active" : "role-option"
            }
            onClick={() => setRole("user")}
            aria-pressed={role === "user"}
          >
            👤 User
          </button>

          <button
            type="button"
            className={
              role === "chef" ? "role-option active" : "role-option"
            }
            onClick={() => setRole("chef")}
            aria-pressed={role === "chef"}
          >
            👨‍🍳 Chef
          </button>
        </div>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p role="status">{message}</p>}
      </form>
    </main>
  );
}

export default Login;
