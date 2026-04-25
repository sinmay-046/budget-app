from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

expenses = []

@app.get("/")
def home():
    return {"message": "Backend running"}

@app.post("/add-expense")
def add_expense(data: dict):
    expenses.append({
        "amount": int(data["amount"]),   # 👈 FIX HERE
        "category": data["category"]
    })
    return {"message": "Added"}

@app.get("/summary")
def summary():
    result = {}
    for e in expenses:
        cat = e["category"]
        result[cat] = result.get(cat, 0) + e["amount"]
    return result
@app.get("/insight")
def insight():
    if not expenses:
        return {"insight": "No data yet"}

    summary = {}
    for e in expenses:
        summary[e["category"]] = summary.get(e["category"], 0) + e["amount"]

    top = max(summary, key=summary.get)
    return {"insight": f"Highest spending is in {top}"}