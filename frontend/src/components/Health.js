import React, { useState, useEffect } from "react";

export default function Health({
  waterIntake,
  setWaterIntake,
  waterDate,
  setWaterDate,
  sleepHours,
  setSleepHours,
  sleepDate,
  setSleepDate,
}) {
  const [waterInput, setWaterInput] = useState("");
  const [sleepInput, setSleepInput] = useState("");
  const WATER_GOAL_OZ = 64; // example daily water goal in oz

  // Aggregate water intake by date
  const dailyWater = waterIntake.reduce((acc, entry) => {
    acc[entry.date] = (acc[entry.date] || 0) + entry.amount;
    return acc;
  }, {});

  // Aggregate sleep hours by date (take average if multiple entries)
  const dailySleepData = sleepHours.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry.hours);
    return acc;
  }, {});
  const dailySleep = Object.entries(dailySleepData).map(([date, hoursArr]) => {
    const avg = hoursArr.reduce((a, b) => a + b, 0) / hoursArr.length;
    return { date, hours: avg };
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const addWaterEntry = () => {
    if (!waterDate || !waterInput) {
      alert("Please enter date and water amount");
      return;
    }
    if (waterInput <= 0) {
      alert("Water amount must be positive");
      return;
    }
    setWaterIntake((prev) => [
      ...prev,
      { date: waterDate, amount: Number(waterInput) },
    ]);
    alert("Water intake logged");
    setWaterInput("");
    setWaterDate("");
  };

  const addSleepEntry = () => {
    if (!sleepDate || !sleepInput) {
      alert("Please enter date and sleep hours");
      return;
    }
    if (sleepInput <= 0 || sleepInput > 24) {
      alert("Sleep hours must be between 0 and 24");
      return;
    }
    setSleepHours((prev) => [
      ...prev,
      { date: sleepDate, hours: Number(sleepInput) },
    ]);
    alert("Sleep hours logged");
    setSleepInput("");
    setSleepDate("");
  };

  // Water progress bar
  const ProgressBar = ({ current, goal }) => {
    const percent = Math.min((current / goal) * 100, 100);
    const overGoal = current > goal;
    return (
      <div className="progress-bar-container">
        <div
          className={`progress-bar-fill ${overGoal ? "overgoal" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  };

  return (
    <>
      <h2>Health Tracker</h2>

      {/* Water Logging */}
      <div className="input-row" style={{ flexWrap: "wrap", gap: 10 }}>
        <label>
          Date:
          <input
            type="date"
            value={waterDate}
            onChange={(e) => setWaterDate(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>

        <input
          type="number"
          min="0"
          step="0.1"
          placeholder="Water intake (oz)"
          value={waterInput}
          onChange={(e) => setWaterInput(e.target.value)}
        />
        <button onClick={addWaterEntry}>Log Water</button>
      </div>

      {/* Sleep Logging */}
      <div className="input-row" style={{ flexWrap: "wrap", gap: 10, marginTop: 20 }}>
        <label>
          Date:
          <input
            type="date"
            value={sleepDate}
            onChange={(e) => setSleepDate(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>

        <input
          type="number"
          min="0"
          max="24"
          step="0.1"
          placeholder="Sleep hours"
          value={sleepInput}
          onChange={(e) => setSleepInput(e.target.value)}
        />
        <button onClick={addSleepEntry}>Log Sleep</button>
      </div>

      {/* Daily Water Summary */}
      <div style={{ marginTop: 30 }}>
        <h3>Water Intake Summary</h3>
        {Object.keys(dailyWater).length === 0 && <div>No water intake logged yet</div>}
        {Object.entries(dailyWater).map(([date, amount]) => (
          <div key={date} className="dashboard-entry">
            <strong>{formatDate(date)}</strong> - {amount.toFixed(1)} oz
            <ProgressBar current={amount} goal={WATER_GOAL_OZ} />
          </div>
        ))}
      </div>

      {/* Daily Sleep Summary */}
      <div style={{ marginTop: 30 }}>
        <h3>Sleep Hours Summary</h3>
        {dailySleep.length === 0 && <div>No sleep logged yet</div>}
        {dailySleep.map(({ date, hours }) => (
          <div key={date} className="dashboard-entry">
            <strong>{formatDate(date)}</strong> - {hours.toFixed(1)} hours
          </div>
        ))}
      </div>
    </>
  );
}
