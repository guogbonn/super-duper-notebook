#! /bin/sh
cd $1/backend/core
uvicorn main:app --reload
