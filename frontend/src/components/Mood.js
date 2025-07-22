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

// Map emoji to a mood score for charting (scale 1-5)
const moodScores = {
  "😞": 1,
  "😐": 2,
  "🙂": 3,
  "😊": 4,
  "😄": 5,
};

const moodOptions = ["😞", "😐", "🙂", "😊", "😄"];

export default function Mood({
  moodEntries,
  setMoodEntries,
  moodDate,
  setMoodDate,
  moodMood,
  setMoodMood,
  moodNote,
  setMoodNote,
}) {
  const [avgMoodData, setAvgMoodData] = useState([]);
  const [mostFreqMood, setMostFreqMood] = useState(null);

  // Calculate average mood per date & most frequent mood overall
  useEffect(() => {
    if (moodEntries.length === 0) {
      setAvgMoodData([]);
      setMostFreqMood(null);
      return;
    }

    // Group by date
    const grouped = moodEntries.reduce((acc, entry) => {
      if (!acc[entry.date]) acc[entry.date] = [];
      acc[entry.date].push(moodScores[entry.mood]);
      return acc;
    }, {});

    // Average mood per date
    const avgData = Object.entries(grouped).map(([date, moods]) => {
      const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
      return { date, avgMood: avg };
    });
    avgData.sort((a, b) => (a.date < b.date ? -1 : 1));
    setAvgMoodData(avgData);

    // Most frequent mood overall
    const freqCount = {};
    moodEntries.forEach((e) => {
      freqCount[e.mood] = (freqCount[e.mood] || 0) + 1;
    });
    let maxCount = 0,
      freqMood = null;
    for (const [mood, count] of Object.entries(freqCount)) {
      if (count > maxCount) {
        maxCount = count;
        freqMood = mood;
      }
    }
    setMostFreqMood(freqMood);
  }, [moodEntries]);

  const logMood = () => {
    if (!moodDate) {
      alert("Please select a date");
      return;
    }
    setMoodEntries((prev) => [
      ...prev,
      { date: moodDate, mood: moodMood, note: moodNote },
    ]);
    alert("Mood logged");
    setMoodDate("");
    setMoodNote("");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  // Calculate mood streak (consecutive days with mood logged)
  const calcStreak = () => {
    if (moodEntries.length === 0) return 0;

    const uniqueDates = Array.from(
      new Set(moodEntries.map((e) => e.date))
    ).sort((a, b) => b.localeCompare(a));

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const dateStr of uniqueDates) {
      const date = new Date(dateStr);
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
      <h2>Mood Tracker</h2>

      <div className="input-row" style={{ flexWrap: "wrap", gap: 10 }}>
        <label>
          Date:
          <input
            type="date"
            value={moodDate}
            onChange={(e) => setMoodDate(e.target.value)}
          />
        </label>

        <label>
          Mood:
          <select
            value={moodMood}
            onChange={(e) => setMoodMood(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            {moodOptions.map((emoji) => (
              <option key={emoji} value={emoji}>
                {emoji}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="input-row" style={{ marginTop: 10 }}>
        <textarea
          rows={2}
          cols={30}
          placeholder="Optional note"
          value={moodNote}
          onChange={(e) => setMoodNote(e.target.value)}
        />
      </div>

      <button onClick={logMood} style={{ marginTop: 10 }}>
        Log Mood
      </button>

      <div style={{ marginTop: 20 }}>
        <h3>Mood Stats</h3>
        <p>
          Most frequent mood:{" "}
          <span style={{ fontSize: "1.5rem" }}>
            {mostFreqMood || "No moods logged"}
          </span>
        </p>
        <p>Mood Streak 🔥: {calcStreak()} days</p>
      </div>

      <div style={{ marginTop: 20, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={avgMoodData}
            margin={{ top: 20, right: 30, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                if (!date) return "";
                return new Date(date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(val) => {
                const moodMap = {
                  1: "😞",
                  2: "😐",
                  3: "🙂",
                  4: "😊",
                  5: "😄",
                };
                return moodMap[val] || val;
              }}
            />
            <Tooltip
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value) => [
                `${value.toFixed(2)} avg mood`,
                "Mood Score",
              ]}
            />
            <Line
              type="monotone"
              dataKey="avgMood"
              stroke="#4caf50"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Mood Log History</h3>
        {moodEntries.length === 0 && <div>No moods logged yet</div>}
        {moodEntries
          .sort((a, b) => (a.date < b.date ? 1 : -1))
          .map(({ date, mood, note }, idx) => (
            <div key={idx} className="dashboard-entry">
              <strong>{formatDate(date)}</strong> - {mood} {note && `| ${note}`}
            </div>
          ))}
      </div>
    </>
  );
}
