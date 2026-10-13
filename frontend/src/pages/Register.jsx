
import { useState } from "react";
import API from "../api/axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const response = await API.post("/api/auth/register", formData);

      setMessage(
        response.data.message || "Registration successful!"
      );
      setMessageType("success");

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Join RecipeHub!</h1>
        <p>Create your account and start exploring.</p>

        <label>Choose account type</label>

        <div className="role-selection">
          <button
            type="button"
            className={`role-option ${
              formData.role === "user" ? "active" : ""
            }`}
            onClick={() =>
              setFormData({ ...formData, role: "user" })
            }
            aria-pressed={formData.role === "user"}
          >
            👤 User
          </button>

          <button
            type="button"
            className={`role-option ${
              formData.role === "chef" ? "active" : ""
            }`}
            onClick={() =>
              setFormData({ ...formData, role: "chef" })
            }
            aria-pressed={formData.role === "chef"}
          >
            👩‍🍳 Chef
          </button>
        </div>

        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {message && (
          <p
            role="status"
            className={
              messageType === "error"
                ? "auth-error"
                : "auth-success"
            }
          >
            {message}
          </p>
        )}
      </form>
    </main>
  );
}

export default Register;
