import DFSMaze3dGenerator from "../maze-3d-gen-dfs.js";
import Maze3d from "../maze-3d-class.js"
import User from "./user.js";
import MazeDomain from "../maze-domain.js";
import DepthFirstSearch from "../serach-algorithms/depth-first-search-algo.js";
import BreadthFirstSearch from "../serach-algorithms/breadth-first-search-algo.js";
import AStar from "../serach-algorithms/a-star-algo.js";
import MazeState from "../state-maze.js";
import Cell from "../cell-class.js";

//handling the start game --> 
    // 1) get params from user fomr
    // 2) generate maze 
    // 3)display maze in maze container using maze we get

let startGameBtn = document.querySelector("#new-game");
let resetBtn = document.querySelector("#reset");
let solveBtn = document.querySelector("#solve");
let saveBtn = document.querySelector("#save-btn");
let loadBtn = document.querySelector("#load-btn");
let nameInput = document.querySelector("#name-load")
let userOptions = document.querySelector("#user-options");
let isHandlerAdded = false;

//globals that account for one of the user and maze
let currentUser; 
let currentMaze; 


//map for saved mazes
let savedMazes = new Map();


//** FUNCTION RESPONSIBLE WHEN "START GAME" BTN IS PRESSED
//  * 
//  * @param {*} event
//  */
function startGameFunction(event){
    let rows = document.querySelector("#rows").value;
    let name = document.querySelector("#name").value;
    let levels = document.querySelector("#levels").value; 
    let p = document.querySelector("#output");

    
    //make a new maze (each time the button is pressed)
    currentMaze = new Maze3d(levels, rows, "dfs");
    console.log(currentMaze.toString());

    let startCoords = currentMaze.board.start.coords; 
    let finishCoords = currentMaze.board.goal.coords;


    //-------TESTING----------------
    p.textContent = `Rows: ${rows} ; `;
    p.textContent += `Name: ${name} ; `;
    p.textContent += `Floor numbers = ${currentMaze.board.length} coords -->`;


    //make a user with name, initialCoords of created board
    currentUser = new User(startCoords, name, currentMaze);

    //display the Floor starting with initial first
    displayFloor(startCoords[0], currentMaze, currentUser);

    p.textContent += ` ${startCoords}  ${finishCoords}`;


    //this global ensures that duplicate window 'keydown' handlers are not added
    if(isHandlerAdded === false){
        window.addEventListener('keydown', handleKeydowns); 
        isHandlerAdded = true;
    }
}

function resetPosition(user){
    user.currCoords = user.initialCoords;
    displayFloor(user.initialCoords[0], user.mazeObj, user);

    //if user is resetting from a game that is ended, add the event listeners back
    if(user.gameOver === true){
        window.addEventListener('keydown', handleKeydowns);
        user.gameOver = false; 
    }
}



// //** THIS FUNCTION WILL GET A PATH TO SOLVE THE MAZE FOR CURRENT USER, THEN CALL ANIMATE PATH TO END
//  * 
//  * @param {*} currentUser 
//  */
function solveMaze(currentUser, fn){
    //get the algo selected from the checkbox
    let algoQuery = document.querySelector("#algo");
    let algoSelection = algoQuery.options[algoQuery.selectedIndex].value;
    let myAlgo; 

    if(algoSelection === "dfs"){
        myAlgo = new DepthFirstSearch();
    }else if(algoSelection === "bfs"){
        myAlgo = new BreadthFirstSearch();
    }else if(algoSelection === "a-star"){
        myAlgo = new AStar();
    }

    //make objects from the searchable class to solve the maze 
    let usersMaze = currentUser.mazeObj; 
    let mazeDomain = new MazeDomain(usersMaze);

    let currentCell = usersMaze.board[currentUser.currCoords[0]][currentUser.currCoords[1]][currentUser.currCoords[2]];
    let currentState = new MazeState(JSON.stringify(currentUser.currCoords), currentCell);
    let solutionPath = myAlgo.search(mazeDomain, currentState);
    animateSolution(solutionPath, currentUser, fn);
    
}

//**
//  * 
//  * @param {array <str>} solutionPath -- array of strings containing directions
//  */
function animateSolution(solutionPath, currentUser, fn){
    const directions = new Map([
        ['left', 'ArrowLeft'],
        ['right', 'ArrowRight'],
        ['forward', 'ArrowUp' ],
        ['backward', 'ArrowDown'],
        ['up', 'w'],
        ['down', 's'],
    ]);


    let i = 0;

    let intervalId = setInterval(() => {
        
        //clear when finished
        if(i === solutionPath.length){
            clearInterval(intervalId);
        }
        
        console.log(solutionPath[i]);
        currentUser.moveUser(directions.get(solutionPath[i]));
        if(solutionPath[i] === "up" || solutionPath[i] === "down"){
            let floorLevelToDisplay = currentUser.currCoords[0]; 
            displayFloor(floorLevelToDisplay, currentUser.mazeObj, currentUser); 
        }
        i++;
    }, 500)
    
    
    let endGameWait = 500 * solutionPath.length;

    setTimeout(() => {
        endGame(currentUser, fn)
    }, endGameWait);

}

//**
//  * 
//  * @param {str} name -- string key for the mape where we save infor of this user
//  */
function saveMaze(name){
    let copyUser = Object.assign({}, currentUser);
    savedMazes.set(name, copyUser);
}

//**
//  * 
//  * @param {str} name key for the map to load the info of the user from before
//  */
function loadMaze(name){
    let userCopied = savedMazes.get(name);
    let userInstance = new User(userCopied.initialCoords, userCopied.name, userCopied.mazeObj)
    currentUser = userInstance; 
    currentMaze = userInstance.mazeObj;
    displayFloor(currentUser.currCoords[0], currentMaze, currentUser);
}

// //** FUNCION HANDLES THE KEYDOWNS FOR MOVEMENT
//  * 
//  * @param {*} event -- the keydown event 
//  */
function handleKeydowns(event){
        
    // let key = event.key
    let key = event.key;

    //prevent default actions for the arrow keys first
    if(key === "ArrowDown" || key === "ArrowUp" || key === "ArrowLeft" || key === "ArrowRight"){
        event.preventDefault(); 
    }
    
    //returnMessage === str "floor up" or "floor down" if we successfully move a floor up or down 
    //returnMessage === str custom error message if move is invalid
    //returnMessage === bool True if game is over
    //returnMessage === undefined if arrow move is successful (graphics transition)
    let returnMessage = currentUser.moveUser(key);

    let errorDisplay = document.querySelector("#error-msg"); 

    if(returnMessage === "floor up" || returnMessage === "floor down"){
        let floorLevelToDisplay = currentUser.currCoords[0]; 
        displayFloor(floorLevelToDisplay, currentUser.mazeObj, currentUser); 

        //check if game is over when we get the the different floor
        if(currentUser.isGameOver(currentUser.currCoords)){
            returnMessage = true; 
        }
    }else if(typeof returnMessage === "string"){ //when error message
        errorDisplay.textContent = returnMessage;
    } 
    
    //checks for the end game conditions 
    if(returnMessage === true){ 
        endGame(currentUser, handleKeydowns);
    }
}

// //** THIS FUNCTION DISPLAYS ONE FLOOR OF THE MAZE
//  * 
//  * @param {*} floorNum -- floor number to display
//  * @param {*} maze -- maze to display
//  * @param {*} user -- user playing currently
//  */
function displayFloor(floorNum, maze, user){ 
    let floorArr = maze.board[floorNum];
    let mazeContainer = document.querySelector("#maze-container");
    if(mazeContainer.className === "game-over"){
        mazeContainer.className = "normal";
    }

    //for writing the floor level next to the maze
    let number = document.querySelector("#number");
    number.textContent = `${floorNum + 1}`;

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

//** THIS FUNCTION STYLES THE DIVS THAT MAKE UP THE CONTENTS OF THE MAZE
//  * 
//  * @param {*} div -- div html element
//  * @param {*} cell -- cell from maze with data representing the maze cell
//  * @param {*} user -- current user
//  */
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
        div.style.backgroundSize = "contain";
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

//** FUNCTION HANDLING END GAME, WILL DELETE USER THEN CALL endGameDisplay() 
//  * 
//  * @param {*} user 
//  */
function endGame(user, fn){

    window.removeEventListener("keydown", fn);
    user.gameOver = true; 
    isHandlerAdded = false; 
    endGameDisplay();
}

// //** FUNCTION TRANSITIONING THE MAZEE TO THE END GAME DISPLAY SCREEN, SAYING YOU WON 
//  * 
//  */
function endGameDisplay(){

    let mazeContainer = document.querySelector("#maze-container");

    //if there is a floor of the maze present, remove it
    if(mazeContainer.children.length !== 0 ){
        let kids = mazeContainer.children; 
        let numberKids = kids.length; 
        for(let i = 0; i < numberKids; i++){
            kids[0].remove();
        }
    }

    //make "YOU WIN" header
    let h3 = document.createElement("h3");
    h3.textContent = "YOU WIN!"; 
    h3.setAttribute("id", "winner");
    mazeContainer.appendChild(h3);

    //set mazeContainer id to game over state
    mazeContainer.setAttribute("class", "game-over");
    

}


//adding the event listeners that we need

startGameBtn.addEventListener('click', startGameFunction); 

resetBtn.addEventListener('click', () => {
    resetPosition(currentUser);
})

solveBtn.addEventListener('click', () => {
    solveMaze(currentUser, handleKeydowns); 
})

//event listeneres for save and load buttons added in
saveBtn.addEventListener('click', () => {
    let name = document.querySelector("#name-load").value;
    saveMaze(name);
})

loadBtn.addEventListener('click', () =>{
    let name = document.querySelector("#name-load").value;
    loadMaze(name);
})

//for when the name input is in focus -- prevents bugs w other keydowns
nameInput.addEventListener('focus', () => {
    window.removeEventListener('keydown', handleKeydowns);
    isHandlerAdded = false;
})
nameInput.addEventListener('blur', () => {
    window.addEventListener('keydown', handleKeydowns);
    isHandlerAdded = true;
})