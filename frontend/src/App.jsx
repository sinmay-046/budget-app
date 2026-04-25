import { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

function App() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState({});
  const total = Object.values(summary).reduce((a, b) => a + b, 0);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const BACKEND = "https://budget-app-wj1v.onrender.com";
  
  const addExpense = async () => {
  if (!amount || !category) return;

  setLoading(true);

  await axios.post(`${BACKEND}/add-expense`, {
    amount: Number(amount),
    category
  });

  setAmount("");
  setCategory("");

  await fetchSummary();
  await fetchInsight();

  setLoading(false);
};

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${BACKEND}/summary`);
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  const fetchInsight = async () => {
    try {
      const res = await axios.get(`${BACKEND}/insight`);
      setInsight(res.data.insight);
    } catch (err) {
      console.error("Error fetching insight:", err);
    }
  };

  const total = Object.values(summary).reduce((a, b) => a + b, 0);

  useEffect(() => {
    fetchSummary();
    fetchInsight();
  }, []);

  return (
  <div style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial"
  }}>
    <div style={{
      background: "rgba(30, 41, 59, 0.9)",
      padding: 30,
      borderRadius: 16,
      width: 380,
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      backdropFilter: "blur(10px)",
      color: "white"
    }}>
      
      <h2 style={{ marginBottom: 20 }}>💰 Budget Tracker</h2>

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          padding: 10,
          marginBottom: 10,
          width: "100%",
          borderRadius: 8,
          border: "none"
        }}
      />

      <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  style={{
    padding: 10,
    marginBottom: 10,
    width: "100%",
    borderRadius: 8,
    border: "none"
  }}
>
  <option value="">Select Category</option>
  <option value="Food">Food</option>
  <option value="Travel">Travel</option>
  <option value="Shopping">Shopping</option>
  <option value="Bills">Bills</option>
  <option value="Other">Other</option>
</select>

      <button
  onClick={addExpense}
  disabled={loading}
  style={{
    padding: 12,
    width: "100%",
    background: loading ? "#64748b" : "#38bdf8",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "pointer"
  }}
>
     {loading ? "Adding..." : "Add Expense"}
      </button>

      <h3 style={{ marginTop: 20 }}>📊 Breakdown</h3>

      <p style={{ marginTop: 10, fontSize: 14, color: "#94a3b8" }}>
        Total: ₹{total}
      </p>

      {Object.keys(summary).length > 0 ? (
        <>
          <div style={{ marginTop: 10 }}>
            <Pie
              data={{
                labels: Object.keys(summary),
                datasets: [
                  {
                    data: Object.values(summary)
                  }
                ]
              }}
            />
          </div>

          <p style={{
            marginTop: 15,
            color: "#38bdf8",
            fontWeight: "bold"
          }}>
            {insight}
          </p>
        </>
      ) : (
        <p style={{ color: "#94a3b8", marginTop: 20 }}>
  No expenses yet. Start by adding one 👆
</p>
      )}
    </div>
  </div>
);
}

export default App;