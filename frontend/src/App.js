import React, { useState, useEffect } from "react";
import "./App.css";

import Nutrition from "./components/Nutrition";
import Activity from "./components/Activity";
import Mood from "./components/Mood";
import Journal from "./components/Journal";
import Health from "./components/Health";
import Charts from "./components/Charts";

function App() {
  const [activeTab, setActiveTab] = useState("Nutrition");

  // Theme toggle
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  // Nutrition states
  const [foodQuery, setFoodQuery] = useState("");
  const [foodResults, setFoodResults] = useState([]);
  const [dietLogs, setDietLogs] = useState([]);
  const [dietDate, setDietDate] = useState("");
  const [calorieGoal, setCalorieGoal] = useState(2000);

  // Activity states
  const [steps, setSteps] = useState([]);
  const [stepInput, setStepInput] = useState("");
  const [stepsDate, setStepsDate] = useState("");

  // Mood states
  const [moodEntries, setMoodEntries] = useState([]);
  const [moodDate, setMoodDate] = useState("");
  const [moodMood, setMoodMood] = useState("😊");
  const [moodNote, setMoodNote] = useState("");

  // Journal states
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalDate, setJournalDate] = useState("");
  const [journalText, setJournalText] = useState("");

  // Health states
  const [waterIntake, setWaterIntake] = useState([]);
  const [waterDate, setWaterDate] = useState("");
  const [sleepHours, setSleepHours] = useState([]);
  const [sleepDate, setSleepDate] = useState("");

  // Tab list
  const tabs = ["Nutrition", "Activity", "Mood", "Journal", "Health", "Charts"];

  // 🔥 Calculate streak (e.g., diet, steps, mood)
  function calcStreak(entries, dateKey = "date") {
    if (entries.length === 0) return 0;
    const sorted = [...entries].sort((a, b) => (a[dateKey] < b[dateKey] ? 1 : -1));
    let streak = 0;
    let currentDate = new Date();
    for (const entry of sorted) {
      const entryDate = new Date(entry[dateKey]);
      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
      if (diffDays <= streak) {
        streak++;
        currentDate = new Date(entryDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else break;
    }
    return streak;
  }

  return (
    <div className="App-container">
      {/* 🌙 Dark Mode Toggle Button */}
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          backgroundColor: darkMode ? "#f0f0f0" : "#222",
          color: darkMode ? "#000" : "#fff",
          zIndex: 9999,
        }}
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      {/* 🔷 Header */}
      <header className="app-header">
        <h1>LifeHub Tracker</h1>
      </header>

      {/* 🔹 Tab Navigation */}
      <nav className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === "Nutrition" && dietLogs.length > 0 && (
              <span className="badge">🔥{calcStreak(dietLogs)}</span>
            )}
            {tab === "Activity" && steps.length > 0 && (
              <span className="badge">🔥{calcStreak(steps)}</span>
            )}
            {tab === "Mood" && moodEntries.length > 0 && (
              <span className="badge">🔥{calcStreak(moodEntries)}</span>
            )}
          </button>
        ))}
      </nav>

      {/* 🔸 Tab Content */}
      <div className="tab-content">
        {activeTab === "Nutrition" && (
          <Nutrition
            foodQuery={foodQuery}
            setFoodQuery={setFoodQuery}
            foodResults={foodResults}
            setFoodResults={setFoodResults}
            dietLogs={dietLogs}
            setDietLogs={setDietLogs}
            dietDate={dietDate}
            setDietDate={setDietDate}
            calorieGoal={calorieGoal}
            setCalorieGoal={setCalorieGoal}
          />
        )}
        {activeTab === "Activity" && (
          <Activity
            steps={steps}
            setSteps={setSteps}
            stepInput={stepInput}
            setStepInput={setStepInput}
            stepsDate={stepsDate}
            setStepsDate={setStepsDate}
          />
        )}
        {activeTab === "Mood" && (
          <Mood
            moodEntries={moodEntries}
            setMoodEntries={setMoodEntries}
            moodDate={moodDate}
            setMoodDate={setMoodDate}
            moodMood={moodMood}
            setMoodMood={setMoodMood}
            moodNote={moodNote}
            setMoodNote={setMoodNote}
          />
        )}
        {activeTab === "Journal" && (
          <Journal
            journalEntries={journalEntries}
            setJournalEntries={setJournalEntries}
            journalDate={journalDate}
            setJournalDate={setJournalDate}
            journalText={journalText}
            setJournalText={setJournalText}
          />
        )}
        {activeTab === "Health" && (
          <Health
            waterIntake={waterIntake}
            setWaterIntake={setWaterIntake}
            waterDate={waterDate}
            setWaterDate={setWaterDate}
            sleepHours={sleepHours}
            setSleepHours={setSleepHours}
            sleepDate={sleepDate}
            setSleepDate={setSleepDate}
          />
        )}
        {activeTab === "Charts" && (
          <Charts
            dietLogs={dietLogs}
            steps={steps}
            moodEntries={moodEntries}
            waterIntake={waterIntake}
            sleepHours={sleepHours}
          />
        )}
      </div>
    </div>
  );
}

export default App;
