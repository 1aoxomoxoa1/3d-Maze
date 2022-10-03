import DFSMaze3dGenerator from "../maze-3d-gen-dfs.js";
import Maze3d from "../maze-3d-class.js"
import User from "./user.js";

//handling the start game --> 
    // 1) get params from user fomr
    // 2) generate maze 
    // 3)display maze in maze container using maze we get

let startGameBtn = document.querySelector("#new-game");
let userOptions = document.querySelector("#user-options");


function startGameFunction(event){
    let rows = document.querySelector("#rows").value;
    let name = document.querySelector("#name").value;
    let levels = document.querySelector("#levels").value; 
    let p = document.querySelector("#output");


   

    //make a new maze (each time the button is pressed)
    let newMaze = new Maze3d(levels, rows, "dfs");
    console.log(newMaze.toString());

    let startCoords = newMaze.board.start.coords; 
    let finishCoords = newMaze.board.goal.coords;


    //-------TESTING----------------
    p.textContent = `Rows: ${rows} ; `;
    p.textContent += `Name: ${name} ; `;
    p.textContent += `Floor numbers = ${newMaze.board.length} coords -->`;


    //make a user with name, initialCoords of created board
    let user = new User(startCoords, name, newMaze);

    //display the Floor starting with initial first
    displayFloor(startCoords[0], newMaze, user);

    p.textContent += ` ${startCoords}  ${finishCoords}`;



    //add event listeners for pushing DIRECTION KEYS so the player can move the char
    window.addEventListener('keydown', (event) => {
        handleKeydowns(event, user);
    }); 

}


function handleKeydowns(event, user){
    
    let key = event.key

    //prevent default actions for the arrow keys first
    if(key === "ArrowDown" || key === "ArrowUp" || key === "ArrowLeft" || key === "ArrowRight"){
        event.preventDefault(); 
    }

    
    //moveUser() --> "floor up" or "floor down" if we successfully move a floor up or down 
    //moveUser() --> custom error message if move is invalid
    //moveUser() --> undefined if arrow move is successful
    let returnMessage = user.moveUser(key);

    let errorDisplay = document.querySelector("#error-msg"); 


    if(returnMessage === "floor up" || returnMessage === "floor down"){
        let floorLevelToDisplay = user.currCoords[0]; 
        displayFloor(floorLevelToDisplay, user.mazeObj, user); 
    }else if(returnMessage !== undefined){
        errorDisplay.textContent = returnMessage;
    }

}

function displayFloor(floorNum, maze, user){ 
    let floorArr = maze.board[floorNum];
    let mazeContainer = document.querySelector("#maze-container");


    //if there is a floor of the maze present, remove it
    if(mazeContainer.children.length !== 0 ){
        let kids = mazeContainer.children; 
        let numberKids = kids.length; 
        for(let i = 0; i < numberKids; i++){
            kids[0].remove();
        }
    }

    //for each coordinate in the maze, make a cell and append it to #maze-container 
    for(let i = 0; i < floorArr.length; i++){
        for(let j = 0; j < floorArr[0].length; j++){
            let cell = floorArr[i][j];
            let div = document.createElement("div");
            applyCellUiStyle(div, cell, user);
            
            //setting properties for sizing
            div.style.flexBasis = String(100 / floorArr.length) + "%"
            div.height = String((100 / floorArr.length) - 1) + "%";
            div.style.boxSizing = "border-box";

            mazeContainer.appendChild(div);
        }
    }

}


function applyCellUiStyle(div, cell, user){
    
    //counter === 6 means cells are completely inaccessible
    let counter = 0; 
    let moves = cell.moves;

    if(moves[0] === false){ 
        div.style.borderLeft = "1px solid black";
        counter++;
    }if(moves[1] === false){
        div.style.borderRight = "1px solid black";
        counter++; 
    }if(moves[2] === false){
        div.style.borderTop = "1px solid black";
        counter++;
    }if(moves[3] === false){
        div.style.borderBottom = "1px solid black";
        counter++; 
    }

    //setting user and goal icons
    // if(cell.start === true){ //setting user icon at start (may break when return to floor w/ initial)
    //     div.style.backgroundImage = "url('images/rat.png')";
    //     div.style.backgroundRepeat = "no-repeat";
    //     div.style.backgroundPosition = "center";
    //     div.style.backgroundSize = "contain";
    // }
    if(JSON.stringify(user.currCoords) === JSON.stringify(cell.coords)){
        div.style.backgroundImage = "url('images/rat.png')";
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundPosition = "center";
        div.style.backgroundSize = "contain";
    }
    else if(cell.goal === true){
        div.style.backgroundImage = "url('images/open-gate.svg')";
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundPosition = "center";
    }else{
        if(moves[4] === false && moves[5] === true){
            div.style.backgroundImage = "url('images/down-arrow.svg')";
            div.style.backgroundRepeat = "no-repeat";
            div.style.backgroundPosition = "center";
        }else if(moves[4] === true && moves[5] === false){
            div.style.backgroundImage = "url('images/up-arrow.svg')";
            div.style.backgroundRepeat = "no-repeat";
            div.style.backgroundPosition = "center";
        }else if(moves[4] === true && moves[5] === true){
            div.style.backgroundImage = "url('images/up-and-down.svg')";
            div.style.backgroundRepeat = "no-repeat";
            div.style.backgroundPosition = "center";
        }else if(moves[4] === false && moves[5] === false){
            counter++;
            counter++;
        }
    }

    if(counter === 6){
        div.style.backgroundColor = "darkgrey";
    }
}


startGameBtn.addEventListener('click', startGameFunction); 

