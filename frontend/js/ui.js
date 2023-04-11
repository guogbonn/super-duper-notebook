function ui_notebook_naming(){
   return  ` 
   <div class = "notebook_naming">
        <p>Create Notebook Name</p>
        <input id="notebook_name" type="text" >
        <button onclick="create_new_notebook(this)">Create</button>
    </div>
    `
}

function ui_notebook_line_item(notebook){
    return  ` 
    <div class="notebook_instance" onclick="selectNotebook('${notebook}')">
        ${notebook}
     </div>
     `
}