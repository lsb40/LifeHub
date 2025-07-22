from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Allow CORS for frontend localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory data storage (replace with DB for production)
users_data = {
    "diet_logs": [],  # List of {date, food_name, calories}
    "steps": []       # List of {date, steps}
}

SPOONACULAR_API_KEY = "80fdbb19cd5b443e96a72188732b1ad7"  # Replace with your key

@app.get("/")
def root():
    return {"message": "LifeHub Backend API is running"}

@app.get("/search_food")
def search_food(query: str):
    # Step 1: Search ingredients by name
    search_url = f"https://api.spoonacular.com/food/ingredients/search?query={query}&number=5&apiKey={SPOONACULAR_API_KEY}"
    search_response = requests.get(search_url)
    if search_response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch from Spoonacular")

    search_data = search_response.json()
    results = []

    # Step 2: For each ingredient, get nutrition info (calories)
    for item in search_data.get("results", []):
        ingredient_id = item.get("id")
        name = item.get("name")

        info_url = f"https://api.spoonacular.com/food/ingredients/{ingredient_id}/information?amount=100&unit=gram&apiKey={SPOONACULAR_API_KEY}"
        info_response = requests.get(info_url)
        if info_response.status_code != 200:
            calories = None
        else:
            info_data = info_response.json()
            calories = None
            # Extract calories from nutrition
            nutrients = info_data.get("nutrition", {}).get("nutrients", [])
            for nutrient in nutrients:
                if nutrient.get("name") == "Calories":
                    calories = nutrient.get("amount")
                    break

        results.append({"name": name, "calories": calories if calories is not None else "N/A"})

    return {"foods": results}

@app.post("/log_diet")
def log_diet(date: str, food_name: str, calories: float):
    users_data["diet_logs"].append({"date": date, "food_name": food_name, "calories": calories})
    return {"status": "success"}

@app.get("/get_diet_logs")
def get_diet_logs():
    return users_data["diet_logs"]

@app.post("/log_steps")
def log_steps(date: str, steps: int):
    users_data["steps"].append({"date": date, "steps": steps})
    return {"status": "success"}

@app.get("/get_steps")
def get_steps():
    return users_data["steps"]
