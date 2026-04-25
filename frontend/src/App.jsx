import { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

function App() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState({});
  const [insight, setInsight] = useState("");
  const BACKEND = "https://budget-app-wj1v.onrender.com";
  
  const addExpense = async () => {
    console.log("clicked");
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

      <input
        placeholder="Category (Food, Travel...)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: 10,
          marginBottom: 10,
          width: "100%",
          borderRadius: 8,
          border: "none"
        }}
      />

      <button
        onClick={addExpense}
        style={{
          padding: 12,
          width: "100%",
          background: "#38bdf8",
          border: "none",
          borderRadius: 8,
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.3s"
        }}
      >
        Add Expense
      </button>

      <h3 style={{ marginTop: 20 }}>📊 Breakdown</h3>

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
        <p>No data yet</p>
      )}
    </div>
  </div>
);
}

export default App;