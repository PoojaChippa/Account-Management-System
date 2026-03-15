import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Statement() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/account/statement")
      .then((res) => setTransactions(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate("/login");
        }
      });
  }, [navigate]);

  return (
    <div className="container">
      <h2>Account Statement</h2>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.created_at).toLocaleDateString()}</td>

              <td
                className={t.transaction_type === "credit" ? "credit" : "debit"}
              >
                {t.transaction_type}
              </td>

              <td>₹{t.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        style={{ marginTop: "20px", background: "#6c757d" }}
        onClick={() => navigate("/")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
