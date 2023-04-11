#! /bin/sh
cd $1/frontend
open "http://localhost:8001/"
python3 -m http.server 8001
