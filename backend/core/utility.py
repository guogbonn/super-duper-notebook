import os 
import settings
import json
import inspect
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


    # set current notebook  
    notebook_settings[felid] = data
    
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


    