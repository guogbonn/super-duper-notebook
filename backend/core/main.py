from fastapi import FastAPI, Header, Request, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import settings
import utility
import os 
import json
from random import randint
import inspect


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


@app.post("/listnotebooks")
async def load_notebook(data: dict = Body(...)):
    try:
        # Get a list of all the items in the directory
        directory_contents = os.listdir(settings.NOTEBOOK_LOCATION)

        # Filter the list to include only subdirectories (i.e., folders)
        subdirectories = [folder for folder in directory_contents if os.path.isdir(os.path.join(settings.NOTEBOOK_LOCATION, folder))]

        return {"notebooks": subdirectories}
    except Exception as e:
        print(e)
        pass

@app.post("/selectnotebook")
async def load_notebook(data: dict = Body(...)):
    try:
        print(f"api_endpoint: {'/selectnotebook'}, notebook_name: {data['notebook_name']}, file line: {inspect.currentframe().f_lineno}")
        utility.update_settings("current_notebook",data['notebook_name'])
        return {}
    except Exception as e:
        print(e)
        pass


@app.post("/createnotebook")
async def active_notebook(data: dict = Body(...)):
    try:
        res = {}
        print(f"notebook_name: {data['notebook_name']}, file line: {inspect.currentframe().f_lineno}")
        # create notebook folder 
        abs_folder = utility.create_folder(data['notebook_name'],settings.NOTEBOOK_LOCATION)
        # create img folder 
        utility.create_folder('img',abs_folder)

        # Define the file path and name
        html = f'{abs_folder}/index.html'
        # Open the file for writing
        with open(html, 'w') as f:
            # Write some text to the file
            f.write('')

        utility.update_settings("current_notebook",data['notebook_name'])     

        return res
    except Exception as e:
        print(e)
        pass

@app.post("/savenotebook")
async def load_notebook(data: dict = Body(...)):
    try:
        content = data["content"]
        current_notebook = utility.get_current_notebook()
        prev = None
        curr = content
        #daisy chain copies of work, older content will be in html 1,2...
        for i in range(0,9):
            num = i 
            if i == 0: num = ""
            try:
                with open(f"{settings.NOTEBOOK_LOCATION}/{current_notebook}/index{num}.html",'r') as outfile:
                    prev = outfile.read()
            except:
                prev = ""
            with open(f"{settings.NOTEBOOK_LOCATION}/{current_notebook}/index{num}.html",'w') as outfile:
                outfile.write(curr)
            curr = prev
        return {}
    except Exception as e:
        print(e)
        pass



@app.post("/loadnotebook")
async def load_notebook():
    try:
        data = {"current_notebook":"", "content": ""}
        """
        check if NOTEBOOK_SETTINGS exists, 
            if it doesn't exist:
                user has not created notebook before, 
                user deleted the settings file and notebooks might or might not exist, 
                user has deleted notebooks folder 
        """
        
        if os.path.isfile(settings.NOTEBOOK_SETTINGS):
            current_notebook = utility.get_current_notebook()
            #  no notebook :(
            if current_notebook == None:
                data["current_notebook"] = current_notebook
                return data
            else:
                # get content of notebook # could delete the folder and this file wouldnt exist
                with open(f"{settings.NOTEBOOK_LOCATION}/{current_notebook}/index.html","r") as index_file:
                    content = index_file.read()
                    data["current_notebook"] = current_notebook
                    data["content"] = content
                return data
                
            

        else:
            from pathlib import Path
            Path(settings.NOTEBOOK_LOCATION).mkdir(parents=True, exist_ok=True)
             
            # Serializing json
            json_object = json.dumps(settings.NOTEBOOK_SETTINGS_BLUEPRINT, indent=4)
            
            # Writing to sample.json
            with open(settings.NOTEBOOK_SETTINGS, "w") as outfile:
                outfile.write(json_object)
            return data
        
    except Exception as e:
        print(e)
        pass

