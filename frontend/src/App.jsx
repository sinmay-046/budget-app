import { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

function App() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState({});
  const [insight, setInsight] = useState("");
  const BACKEND = "http://127.0.0.1:8000";
  
  const addExpense = async () => {
    if (!amount || !category) return;

    await axios.post(`${BACKEND}/add-expense`,{
      amount: Number(amount),
      category: category
    });

    setAmount("");
    setCategory("");
    fetchSummary();
    fetchInsight();
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

  useEffect(() => {
    fetchSummary();
    fetchInsight();
  }, []);

  return (
  <div style={{
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}>
    <div style={{
      background: "#1e293b",
      padding: 30,
      borderRadius: 12,
      width: 400,
      textAlign: "center"
    }}>
      <h2>💰 Team Budget Tracker</h2>

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: 8, margin: 5, width: "90%" }}
      />

      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: 8, margin: 5, width: "90%" }}
      />

      <button
        onClick={addExpense}
        style={{
          padding: 10,
          marginTop: 10,
          width: "95%",
          background: "#38bdf8",
          border: "none",
          borderRadius: 6
        }}
      >
        Add Expense
      </button>

      <h3 style={{ marginTop: 20 }}>Category Breakdown</h3>

      {Object.keys(summary).length > 0 ? (
  <div style={{ width: 400 }}>
    <Pie
      data={{
        labels: Object.keys(summary),
        datasets: [{ data: Object.values(summary) }]
      }}
    />

    {/* 👇 THIS GOES HERE (UNDER CHART) */}
    <p style={{ marginTop: 15, color: "#38bdf8" }}>
      {insight}
    </p>

  </div>
) : (
  <p>No data yet</p>
)}
    </div>
  </div>
);
}

export default App;