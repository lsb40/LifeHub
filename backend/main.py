from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os
load_dotenv()


app = FastAPI()

#Allow CORS for frontend localhost:3000
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Add your frontend local URL here
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

origins = [
    "http://localhost:3000",  # for local testing
    "https://lifehub-frontend.onrender.com",  # Replace with Render frontend URL once deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


# In-memory data storage (replace with DB for production)
users_data = {
    "diet_logs": [],  # List of {date, food_name, calories}
    "steps": []       # List of {date, steps}
}

USDA_API_KEY = os.getenv("USDA_API_KEY")

@app.get("/")
def root():
    return {"message": "LifeHub Backend API is running"}

USDA_API_KEY = os.getenv("USDA_API_KEY")

@app.get("/search_food")
@app.get("/search_food")
def search_food(query: str):
    try:
        url = "https://api.nal.usda.gov/fdc/v1/foods/search"
        params = {
            "query": query,
            "api_key": USDA_API_KEY
        }
        response = requests.get(url, params=params)
        data = response.json()

        if "foods" in data:
            results = []
            for food in data["foods"][:5]:
                nutrients = {n["nutrientName"]: n["value"] for n in food.get("foodNutrients", [])}
                results.append({
                    "name": food.get("description", "Unnamed Food"),
                    "calories": nutrients.get("Energy", 0),
                    "protein": nutrients.get("Protein", 0),
                    "fat": nutrients.get("Total lipid (fat)", 0),
                    "carbs": nutrients.get("Carbohydrate, by difference", 0),
                })
            return {"foods": results}
        else:
            return {"foods": [], "error": "No foods found."}
    except Exception as e:
        return {"error": str(e)}

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
