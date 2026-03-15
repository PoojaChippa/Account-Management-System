import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function SendMoney() {
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/account/users").then((res) => setUsers(res.data));
  }, []);

  const send = async () => {
    await API.post("/account/transfer", {
      receiverId,
      amount: Number(amount),
    });

    alert("Transfer Successful");

    navigate("/"); // redirect to dashboard
  };

  return (
    <div className="container">
      <h2>Send Money</h2>

      <select onChange={(e) => setReceiverId(e.target.value)}>
        <option>Select User</option>

        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      <input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />

      <button onClick={send}>Transfer</button>

      <button
        style={{ marginTop: "10px", background: "#6c757d" }}
        onClick={() => navigate("/")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
