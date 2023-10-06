#! /bin/sh
cd $1/backend/core
PORT=8000
PID=$(lsof -ti :$PORT)
if [[ -n "$PID" ]]; then
    kill $PID
fi
uvicorn main:app --reload --host 127.0.0.1 --port $PORT