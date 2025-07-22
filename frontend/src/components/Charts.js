import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Helper: format date string "YYYY-MM-DD" to "MMM D"
const formatDateLabel = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

// Calculate average mood score from mood entries per date
const MOOD_SCORES = { "😞": 1, "😐": 2, "🙂": 3, "😊": 4, "😄": 5 };

export default function Charts({ dietLogs, steps, moodEntries, waterIntake, sleepHours }) {
  // Combine all dates present
  const allDates = useMemo(() => {
    const dates = new Set([
      ...dietLogs.map((d) => d.date),
      ...steps.map((s) => s.date),
      ...moodEntries.map((m) => m.date),
      ...waterIntake.map((w) => w.date),
      ...sleepHours.map((s) => s.date),
    ]);
    return Array.from(dates).sort();
  }, [dietLogs, steps, moodEntries, waterIntake, sleepHours]);

  // Aggregate diet calories per date
  const caloriesPerDate = dietLogs.reduce((acc, log) => {
    acc[log.date] = (acc[log.date] || 0) + log.calories;
    return acc;
  }, {});

  // Aggregate steps per date
  const stepsPerDate = steps.reduce((acc, s) => {
    acc[s.date] = (acc[s.date] || 0) + s.steps;
    return acc;
  }, {});

  // Aggregate average mood per date
  const moodPerDateData = moodEntries.reduce((acc, m) => {
    if (!acc[m.date]) acc[m.date] = [];
    acc[m.date].push(MOOD_SCORES[m.mood] || 3);
    return acc;
  }, {});
  const avgMoodPerDate = {};
  for (const [date, scores] of Object.entries(moodPerDateData)) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    avgMoodPerDate[date] = avg;
  }

  // Aggregate water intake per date
  const waterPerDate = waterIntake.reduce((acc, w) => {
    acc[w.date] = (acc[w.date] || 0) + w.amount;
    return acc;
  }, {});

  // Aggregate average sleep hours per date
  const sleepPerDateData = sleepHours.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s.hours);
    return acc;
  }, {});
  const avgSleepPerDate = {};
  for (const [date, hoursArr] of Object.entries(sleepPerDateData)) {
    const avg = hoursArr.reduce((a, b) => a + b, 0) / hoursArr.length;
    avgSleepPerDate[date] = avg;
  }

  // Build combined data array sorted by date ascending
  const chartData = allDates.map((date) => ({
    date,
    calories: caloriesPerDate[date] || 0,
    steps: stepsPerDate[date] || 0,
    mood: avgMoodPerDate[date] || null,
    water: waterPerDate[date] || 0,
    sleep: avgSleepPerDate[date] || 0,
  }));

  return (
    <>
      <h2>LifeHub Summary Charts</h2>

      {/* Calories Chart */}
      <div style={{ height: 250, marginBottom: 30 }}>
        <h3>Calories Consumed</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDateLabel} />
            <YAxis />
            <Tooltip labelFormatter={formatDateLabel} />
            <Line type="monotone" dataKey="calories" stroke="#ff7f50" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Steps Chart */}
      <div style={{ height: 250, marginBottom: 30 }}>
        <h3>Steps Taken</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDateLabel} />
            <YAxis />
            <Tooltip labelFormatter={formatDateLabel} />
            <Line type="monotone" dataKey="steps" stroke="#28a745" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mood Chart */}
      <div style={{ height: 250, marginBottom: 30 }}>
        <h3>Average Mood</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDateLabel} />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
            <Tooltip
              labelFormatter={formatDateLabel}
              formatter={(value) => value?.toFixed(2)}
            />
            <Line type="monotone" dataKey="mood" stroke="#4caf50" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Water Intake Chart */}
      <div style={{ height: 250, marginBottom: 30 }}>
        <h3>Water Intake (oz)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDateLabel} />
            <YAxis />
            <Tooltip labelFormatter={formatDateLabel} />
            <Line type="monotone" dataKey="water" stroke="#00bfff" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sleep Hours Chart */}
      <div style={{ height: 250, marginBottom: 30 }}>
        <h3>Sleep Hours</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDateLabel} />
            <YAxis />
            <Tooltip labelFormatter={formatDateLabel} />
            <Line type="monotone" dataKey="sleep" stroke="#9370db" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
