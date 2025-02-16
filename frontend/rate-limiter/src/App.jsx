import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [requestCount, setRequestCount] = useState(0);
  const [remainingRequests, setRemainingRequests] = useState(10);
  const [darkMode, setDarkMode] = useState(false);

  const maxRequests = 10; // Rate limit from backend

  const fetchData = async () => {
    try {
      const response = await axios.get("https://rate-limiter-demo.onrender.com/api");
      setMessage(response.data.message);
      setRequestCount(prev => prev + 1);
      setRemainingRequests(maxRequests - (requestCount + 1));
    } catch (error) {
      setMessage(error.response?.data?.message || "Error fetching data");
    }
  };

  useEffect(() => {
    if (requestCount >= maxRequests) {
      setMessage("Rate limit exceeded. Try again later.");
    }
  }, [requestCount]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const data = [
    { name: "Requests Sent", value: requestCount },
    { name: "Remaining Requests", value: remainingRequests },
  ];

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      {/* Dark Mode Toggle */}
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? "🌞" : "🌙"}
      </button>

      <h1>Rate Limiter Demo</h1>

      {/* Send Request Button */}
      <button onClick={fetchData} disabled={requestCount >= maxRequests}>
        Send Request
      </button>

      <p>{message}</p>

      {/* Bar Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barSize={40}>
            <XAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
            <YAxis stroke={darkMode ? "#fff" : "#000"} />
            <Tooltip />
            <Bar dataKey="value" fill={darkMode ? "#38bdf8" : "#007bff"} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div
          className={`progress-bar ${remainingRequests > 0 ? "green" : "red"}`}
          style={{ width: `${(remainingRequests / maxRequests) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default App;
