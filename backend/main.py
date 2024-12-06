

# from pdb import set_trace
# set_trace()
# from src.services import get_notes_by_names, scales, notes_data
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from src.services.db import notes_data, get_notes_by_names, scales, accuracy_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)



# Endpoint to get all notes
@app.get("/get_notes")
def get_notes():
    return [note.__dict__ for note in notes_data]

# Endpoint to get scales
@app.get("/get_scales")
def get_scales():
    return {scale: get_notes_by_names(note_names) for scale, note_names in scales.items()}


@app.post("/store_accuracy")
def store_accuracy(data: dict):
    accuracy_data.append(data)
    return {"status": "success"}

# Endpoint to retrieve accuracy data (for future use)
@app.get("/accuracy_data")
def get_accuracy_data():
    return {"data": accuracy_data}

# Testing: Run this script with uvicorn to serve the backend
# Example: uvicorn main:app --reload





