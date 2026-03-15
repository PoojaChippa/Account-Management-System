import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { token, logout } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    API.get("/account/balance")
      .then((res) => setBalance(res.data.balance))
      .catch((err) => {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      });
  }, [token, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <h3>Balance ₹{balance}</h3>

      <div style={{ marginTop: "20px" }}>
        <Link to="/send">Send Money</Link>
        <br />
        <Link to="/statement">Account Statement</Link>
      </div>

      <button
        style={{ marginTop: "20px", background: "#dc3545" }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
