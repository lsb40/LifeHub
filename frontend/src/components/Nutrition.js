import React, { useState } from "react";

const API_BASE = "https://life-hub-back.vercel.app";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function Nutrition({
  foodQuery,
  setFoodQuery,
  foodResults,
  setFoodResults,
  dietLogs,
  setDietLogs,
  dietDate,
  setDietDate,
  calorieGoal,
  setCalorieGoal,
}) {
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");

  // Search food from backend
  const searchFood = async () => {
    if (!foodQuery) return;
    try {
      const res = await fetch(`${API_BASE}/search_food?query=${foodQuery}`);
      const data = await res.json();
      setFoodResults(data.foods || []);
    } catch {
      alert("Error fetching food data.");
    }
  };

  // Log diet item with macros and meal type
  const logDiet = (food) => {
    if (!dietDate) {
      alert("Please enter a date to log the diet item");
      return;
    }
    setDietLogs((prev) => [
      ...prev,
      {
        date: dietDate,
        food_name: food.name,
        calories: Number(food.calories),
        protein: Number(food.protein) || 0,
        fat: Number(food.fat) || 0,
        carbs: Number(food.carbs) || 0,
        meal: selectedMeal,
      },
    ]);
    alert(`Logged ${food.name} for ${selectedMeal}`);
  };

  // Aggregate calories and macros by date
  const dailySummary = dietLogs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = { calories: 0, protein: 0, fat: 0, carbs: 0 };
    acc[log.date].calories += log.calories;
    acc[log.date].protein += log.protein;
    acc[log.date].fat += log.fat;
    acc[log.date].carbs += log.carbs;
    return acc;
  }, {});

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  // Progress bar for calories
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
      <h2>Nutrition</h2>

      <div className="input-row">
        <input
          type="text"
          placeholder="Search food..."
          value={foodQuery}
          onChange={(e) => setFoodQuery(e.target.value)}
        />
        <button onClick={searchFood}>Search</button>
      </div>

      <div className="input-row" style={{ marginTop: 10, flexWrap: "wrap", gap: 15 }}>
        <label>
          Date to log:
          <input
            type="date"
            value={dietDate}
            onChange={(e) => setDietDate(e.target.value)}
          />
        </label>

        <label>
          Meal:
          <select
            value={selectedMeal}
            onChange={(e) => setSelectedMeal(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            {MEAL_TYPES.map((meal) => (
              <option key={meal} value={meal}>
                {meal}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        {foodResults.length === 0 && <div style={{ marginTop: 10 }}>No results yet</div>}
        {foodResults.map((food, idx) => (
          <div key={idx} className="food-result">
            <span>
              <b>{food.name}</b> - Calories: {food.calories} kcal | Protein: {food.protein}g | Fat: {food.fat}g | Carbs: {food.carbs}g
            </span>
            <button onClick={() => logDiet(food)}>Log</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Daily Calorie Goal</h3>
        <input
          type="number"
          value={calorieGoal}
          onChange={(e) => setCalorieGoal(Number(e.target.value))}
          min={0}
        />
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Diet Logs Summary (Daily Calories & Macros)</h3>
        {Object.entries(dailySummary).length === 0 && <div>No diet logs yet</div>}
        {Object.entries(dailySummary).map(([date, sum]) => {
          const overGoal = sum.calories > calorieGoal;
          return (
            <div key={date} className="dashboard-entry">
              <strong>{formatDate(date)}</strong> -{" "}
              <span className={overGoal ? "overgoal" : ""}>
                {sum.calories.toFixed(1)} cal
              </span>{" "}
              | Protein: {sum.protein.toFixed(1)}g | Fat: {sum.fat.toFixed(1)}g | Carbs:{" "}
              {sum.carbs.toFixed(1)}g
              <ProgressBar current={sum.calories} goal={calorieGoal} />
            </div>
          );
        })}
      </div>
    </>
  );
}
