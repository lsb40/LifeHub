import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Activity({
  steps,
  setSteps,
  stepInput,
  setStepInput,
  stepsDate,
  setStepsDate,
}) {
  const [dailySteps, setDailySteps] = useState([]);

  // Aggregate steps by date for chart and display
  useEffect(() => {
    const agg = steps.reduce((acc, entry) => {
      acc[entry.date] = (acc[entry.date] || 0) + entry.steps;
      return acc;
    }, {});

    // Convert to array sorted by date ascending
    const sorted = Object.entries(agg)
      .map(([date, steps]) => ({ date, steps }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    setDailySteps(sorted);
  }, [steps]);

  const logStepCount = () => {
    if (!stepsDate || !stepInput) {
      alert("Please enter date and steps");
      return;
    }
    if (stepInput <= 0) {
      alert("Step count must be positive");
      return;
    }
    setSteps((prev) => [...prev, { date: stepsDate, steps: Number(stepInput) }]);
    alert("Logged steps");
    setStepInput("");
    setStepsDate("");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  // Calculate streak of consecutive days with steps
  const calcStreak = () => {
    if (dailySteps.length === 0) return 0;
    // Sort descending
    const sortedDates = dailySteps
      .map((entry) => new Date(entry.date))
      .sort((a, b) => b - a);

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const date of sortedDates) {
      const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
      if (diffDays === streak) {
        streak++;
        currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (diffDays > streak) {
        break;
      }
    }
    return streak;
  };

  return (
    <>
      <h2>Activity - Steps Log</h2>

      <div className="input-row" style={{ flexWrap: "wrap", gap: 10 }}>
        <label>
          Date for steps log:{" "}
          <input
            type="date"
            value={stepsDate}
            onChange={(e) => setStepsDate(e.target.value)}
          />
        </label>

        <input
          type="number"
          placeholder="Steps"
          min={1}
          value={stepInput}
          onChange={(e) => setStepInput(e.target.value)}
        />
        <button onClick={logStepCount}>Log Steps</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Step Streak 🔥: {calcStreak()} days</h3>
      </div>

      <div style={{ marginTop: 20, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailySteps} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                if (!date) return "";
                return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
              }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value) => [`${value} steps`, "Steps"]}
            />
            <Line
              type="monotone"
              dataKey="steps"
              stroke="#28a745"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Steps Log (Daily Totals)</h3>
        {dailySteps.length === 0 && <div>No steps logged yet</div>}
        {dailySteps.map(({ date, steps }) => (
          <div key={date} className="dashboard-entry">
            <strong>{formatDate(date)}</strong> - {steps} steps
          </div>
        ))}
      </div>
    </>
  );
}
