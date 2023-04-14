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

function getSelectedElements() {
    var sel = window.getSelection();
    if (sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var startElement = range.startContainer.parentElement;
      var endElement = range.endContainer.parentElement;
      var selectedElements = [];
      if (startElement === endElement) {
        selectedElements.push(startElement);
      } else {
        var element = startElement;
        while (element && element !== endElement) {
          selectedElements.push(element);
          element = element.nextElementSibling;
        }
        selectedElements.push(endElement);
      }
      return selectedElements;
    }
    return null;
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
    saveNotebook()
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
    var focusedElement = document.activeElement;
    var selectedElements =  getSelectedElements();
    console.log("selectedElements",selectedElements)
    if (e.target == nbG && event_conditions.notebookLocation == null  && !focusedElement.classList.contains("section_") ){
        // Create a new div element
        const editableDiv = document.createElement("div");
        // Add the "section" class to the new element
        editableDiv.classList.add("section_");
        // Make the div element editable
        editableDiv.contentEditable = true;
        // Add the div element to an existing element
        nbG.appendChild(editableDiv);

        editableDiv.focus();
        keypressEvent();
    }
    // merge section 

    // move section 

    // link section 
   if( event_conditions.notebookLocation == null){
    saveNotebook()
   }
    
}

keyPressEvent = [];

function sectionKeyPress(e){
    console.log(e, e.target);
    var selectedElements =  getSelectedElements();

    const selection = window.getSelection();
const element = selection.anchorNode.parentElement;
console.log("current node",element,selection.anchorNode);
   
    console.log("selectedElements",selectedElements)
    //delete section 
    if (e.key == "Backspace" && e.target.textContent == ""){
            e.target.remove();
    }

    if (e.key === "Enter") {
        e.preventDefault();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const br = document.createElement("br");
        range.deleteContents();
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    

      if (e.key === "Tab") {
        e.preventDefault();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
      
        const tabCharacter = "\t";
      
        range.deleteContents();
        range.insertNode(document.createTextNode(tabCharacter));
      
        // Move the cursor after the new tab character
        try {
            range.setStartAfter(range.startContainer.childNodes[range.startOffset]);

        } catch (error) {
            
        }
        range.collapse(true);
      
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      
      
      
      
}

function keypressEvent(){
    var section = document.getElementsByClassName("section_");
    for (var i = 0; i < section.length; i++){
        if (!keyPressEvent.includes( section[i]))
        section[i].addEventListener("keydown",function(e){sectionKeyPress(e)})
    }

}

function pageClickEvent(){
    nbG.addEventListener("click",function(e) {
        debounce(handlePageClick(e), 100);
    })
}

function saveNotebook(){
    if (document.getElementById("notebook_name") == null){
        postToServer("savenotebook",{"content": nbG.innerHTML});
    }else{
        console.log("don't save")
    }
}
var userSelection = null;
function watchHighlighting(){
// Get the document element
const doc = document.documentElement;

// Listen for the 'mouseup' event on the document
doc.addEventListener('mouseup', () => {
  // Get the selected text
  userSelection = window.getSelection().toString();
  
  // Log the selected text to the console
  console.log("users selection",userSelection);
});
}

function toolbar(){
          // Attach a click event listener to each toolbar button
          const buttons = document.querySelectorAll(".toolbar button");
          buttons.forEach(function (button) {
            button.addEventListener("click", function () {
              const command = button.dataset.command;
              if (command == "hiliteColor"){
                document.execCommand("hiliteColor", false, "yellow");
              } else if (command == "createLink"){
                document.execCommand("createLink", false, userSelection);
                openWebpages();
              } else{
                document.execCommand(command, false, null);
              }
            });
          });
}

var anchorWatch = []
function openWebpages(){
    var anchors = document.getElementsByTagName("a");
    for (var i = 0; i < anchors.length; i++){
        if (!anchorWatch.includes( anchors[i]))
        anchors[i].addEventListener("click",function(e){
            const href = e.target.getAttribute("href");
            // Open the link in a new tab
            window.open(href, "_blank");
            // Prevent the default behavior of the anchor tag
            e.preventDefault();
        })
    }
}


function main(){
nbG = document.getElementById("notebook");

loadNotebook();
listNotebooks();
// creates click event handler to determine necessary action to take when the notebook page is clicked on 
//UI Events
pageClickEvent();
keypressEvent();
watchHighlighting();
toolbar();
openWebpages();
}