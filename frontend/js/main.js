nbG = null;

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
  



function handlePageClick(e){
    // create section
    console.log("click",e);
    if (e.target == nbG){
    // Create a new div element
    const editableDiv = document.createElement("div");

    // Make the div element editable
    editableDiv.contentEditable = true;

    // Add the div element to an existing element
    nbG.appendChild(editableDiv);

    editableDiv.focus();

    }


    // merge section 

    // move section 

    // link section 
}

function pageClickEvent(){
    nbG.addEventListener("click",function(e) {

        debounce(handlePageClick(e), 100);


    })
}

function main(){
nbG = document.getElementById("notebook");
// creates click event handler to determine necessary action to take when the notebook page is clicked on 
pageClickEvent();
}