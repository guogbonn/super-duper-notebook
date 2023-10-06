import os 
import settings
import json
import inspect
import subprocess
import zipfile
def create_folder(folder_name, parent_dir):
        
        new_folder_path = os.path.join(parent_dir, f'{folder_name}')
        # Create the new folder using the full path
        os.mkdir(new_folder_path)
        return new_folder_path


def update_settings(felid,data):
        # Update settings 
        # read the json file in 
    with open(settings.NOTEBOOK_SETTINGS, "r") as json_object:
        notebook_settings = json.load(json_object)
    
    prev = notebook_settings[felid]
    # set current notebook  
    notebook_settings[felid] = data

    print(f"Saving Notebook\nPrevious Active Notebook: {prev}\nCurrent Active Notebook {notebook_settings[felid]}")

    
    
    # Serializing json
    json_object = json.dumps(notebook_settings, indent=4)
    
    # Writing to sample.json
    with open(settings.NOTEBOOK_SETTINGS, "w") as outfile:
        outfile.write(json_object)

def get_current_notebook():
    # read the json file in 
    with open(settings.NOTEBOOK_SETTINGS, "r") as json_object:
        notebook_settings = json.load(json_object)
    # get current notebook
    print(f"notebook_settings: {notebook_settings}, file line: {inspect.currentframe().f_lineno}")
    current_notebook = notebook_settings["current_notebook"]
    return current_notebook


def daisyChainNotebook(location,current_notebook,curr,prev):
    for i in range(0,3):
        num = i 
        if i == 0: num = ""
        try:    
            with open(f"{location}/{current_notebook}/index{num}.html",'r') as outfile:
                prev = outfile.read()
        except:
            prev = ""
        with open(f"{location}/{current_notebook}/index{num}.html",'w') as outfile:
            outfile.write(curr)

        curr = prev

    