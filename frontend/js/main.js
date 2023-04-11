nbG = null;
sever = "http://127.0.0.1:8000/"

event_conditions = {
    "notebookLocation":null
}
function postToServer(endpoint, data){
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    
    // Open a synchronous POST request to the server
    xhr.open('POST', `${sever}${endpoint}`, false);

    // Set the Content-Type header to "application/json"
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Send the request with the JSON payload
    xhr.send(JSON.stringify(data));

    // Check the response status and content
    if (xhr.status === 200) {
       
    console.log("endpoint",endpoint, "server response",JSON.parse(xhr.responseText));
    return JSON.parse(xhr.responseText)
    } else {
    console.error('POST request failed');
    }
}


function debounce(func, delay) {
    let timeoutId;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

// encrypt files for privacy 

function create_new_notebook(){
    console.log();
    var notebook_name = document.getElementById("notebook_name").value
    postToServer("createnotebook",{notebook_name})
    nbG.innerHTML = ""
    event_conditions.notebookLocation = null;
    document.getElementById("notebook_title").innerHTML = notebook_name 
    listNotebooks()
}


// load notebook 
function loadNotebook(){
    var serverResponse = postToServer("loadnotebook",{})
    
    if (serverResponse["current_notebook"] == null || serverResponse["current_notebook"] == ''   ){
        //prompt user to create a notebook folder 
        console.log("add notebook input ui")
        nbG.innerHTML = ui_notebook_naming();
        event_conditions.notebookLocation = true
    }else{
        document.getElementById("notebook_title").innerHTML = serverResponse["current_notebook"]
        nbG.innerHTML = serverResponse["content"]
    }
    listNotebooks()
}

// delete notebook 

function selectNotebook(notebook_name){
    postToServer("selectnotebook",{notebook_name})
    loadNotebook();
}

function addNotebook(){
    nbG.innerHTML = ui_notebook_naming();
    event_conditions.notebookLocation = true;
}

// list files 

function listNotebooks(){
    var res = ""
    var serverResponse = postToServer("listnotebooks",{})
    for (var i = 0; i < serverResponse["notebooks"].length; i++){
        console.log(serverResponse["notebooks"][i]);
       res += ui_notebook_line_item(serverResponse["notebooks"][i])
    }
    document.getElementById("notebooklist").innerHTML = res; 
}

// show graph 
// paste images 
// embedd video 
// search for file 


function handlePageClick(e){
    // create section
    console.log("click",e);
    if (e.target == nbG && event_conditions.notebookLocation == null){
        // Create a new div element
        const editableDiv = document.createElement("div");

        // Add the "section" class to the new element
        editableDiv.classList.add("section_");

        // Make the div element editable
        editableDiv.contentEditable = true;

        // Add the div element to an existing element
        nbG.appendChild(editableDiv);

        editableDiv.focus();
        
    }



    // merge section 

    // move section 

    // link section 
   if( event_conditions.notebookLocation == null){
    postToServer("savenotebook",{"content": nbG.innerHTML});
   }
    
}

function pageClickEvent(){
    nbG.addEventListener("click",function(e) {
        debounce(handlePageClick(e), 100);
    })
}

function main(){
nbG = document.getElementById("notebook");

loadNotebook();
listNotebooks();
// creates click event handler to determine necessary action to take when the notebook page is clicked on 
//UI Events
pageClickEvent();
}