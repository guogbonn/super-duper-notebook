from fastapi import FastAPI, Header, Request, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import settings

import json
from random import randint


app = FastAPI()

backend_process_state = {}

origins = [

    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8001",
    "http://localhost:8000",

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/ping")
async def ping():
    return {"live":"sucess"}




@app.get("/courselist")
async def course_list():
    try:

        return dict_courses
    except Exception as e:
        pass





@app.post("/updatedoc")
async def updateDoc(data: dict = Body(...)):
    res = ""
    return { "response": json.dumps(res)}
    try:
        pass
    except Exception as e:
        pass
