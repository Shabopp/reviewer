import { useState } from "react";
import { signInWithEmail } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const styles = {
    wrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh", // Full screen height
      backgroundColor: "#f7fafc", // Light background
      padding: "1rem",
    },
    container: {
      width: "100%",
      maxWidth: "400px",
      padding: "2.5rem",
      backgroundColor: "#fff",
      borderRadius: "16px",
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#4a148c",
      marginBottom: "1.5rem",
      textAlign: "center",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#4a5568",
    },
    input: {
      padding: "0.75rem 1rem",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      fontSize: "1rem",
      transition: "border-color 0.3s, box-shadow 0.3s",
      outline: "none",
    },
    button: {
      padding: "0.9rem",
      backgroundColor: "#6b46c1",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s, transform 0.1s",
      marginTop: "0.5rem",
    },
    error: {
      color: "#e53e3e",
      fontSize: "0.875rem",
      marginTop: "0.5rem",
      textAlign: "center",
      animation: "fadeIn 0.3s ease-in-out",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                ...styles.input,
                borderColor: email ? "#6b46c1" : "#e2e8f0",
              }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#553c9a")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#6b46c1")}
            onMouseDown={(e) => (e.target.style.transform = "scale(0.96)")}
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          >
            Sign In
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
