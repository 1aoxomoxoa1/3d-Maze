import Searchable from "./searchable.js";
import MazeState from "./state-maze.js";
import Node from "./node.js";

class MazeDomain extends Searchable{

    // //**
    //  * 
    //  * @param {*} threeDMaze -- board instance used to reference 
    //  */
    constructor(threeDMaze){
        super();
        this.board = threeDMaze.board; 
        this.initialState = undefined; 
        this.goalState = undefined; 
        //go back in and intialize these states
        this.createStates(); 

    }

    createStates(){
        //create the state object for the initial & goal cells that are contained w/in board obj
        let initialCell = this.board.start;
        let goalCell = this.board.goal; 

        let initialState = new MazeState(JSON.stringify(initialCell.coords), initialCell); 
        let goalState = new MazeState(JSON.stringify(goalCell.coords), goalCell)
        this.initialState = initialState; 
        this.goalState = goalState; 
    }

    get initial(){
        return this.initialState; 
    }

    get goal(){
        return this.goalState;
    }
    
    set initial(initial){
        this.initialState = initial; 
    }

    set goal(goal){
        this.goalState = goal; 
    }

    //should return all of the other directions of neighboring nodes that === true (can be moved to )
    //  **
    //  * 
    //  * @param {*} node -- node (Node Object) being explored, is the parent for these successors
    //  * @returns function returning available move directions into a tuple containing (direction [action], coords [nextCoords] )
    //  */
    successor(currNode){
        
        //get information from the state
        let state = currNode.state; 
        let coords = state.cell.coords;
        let myCell = state.cell;

        let possibleMoveDirections = [];


        //check for moves allowed from the current state
        if(myCell.moves[0] === true){
            possibleMoveDirections.push("left");
        }
        if(myCell.moves[1] === true){
            possibleMoveDirections.push("right");
        }
        if(myCell.moves[2] === true){
            possibleMoveDirections.push("forward");
        }
        if(myCell.moves[3] === true){
            possibleMoveDirections.push("backward");
        }
        if(myCell.moves[4] === true){
            possibleMoveDirections.push("up");
        }
        if(myCell.moves[5] === true){
            possibleMoveDirections.push("down");
        }

        //we want to turn the available move directions into a tuple containing (direction [action], coords [nextCoords] )
        return this.convertMovesToTup(possibleMoveDirections, state); 

    }

    //**
    //  * 
    //  * @param {*} possibleMoveDirections -- a list of all the direction you CAN move from the starting state
    //  * @param {*} currStart -- the starting state -- we want the states that you can move to from here 
    //  * @returns a list of tuples [["direction", State], ...] that we can convert into nodes 
    //  */
    convertMovesToTup(possibleMoveDirections, currState){
        
        let returnTuples = []; 
        let currCoords = currState.cell.coords; 

        for(let i = 0; i < possibleMoveDirections.length ; i++){

            //for each direction that can be moved to from currState
            let direction = possibleMoveDirections[i];

            if(direction === "left"){
                let nextCoords = [...currCoords];
                nextCoords[2] -= 1; 
                let nextState = new MazeState(JSON.stringify(nextCoords), this.board[nextCoords[0]][nextCoords[1]][nextCoords[2]]);
                let tup = [direction, nextState]
                returnTuples[i] = tup; 
            }else if(direction === "right"){
                let nextCoords = [...currCoords];
                nextCoords[2] += 1; 
                let nextState = new MazeState(JSON.stringify(nextCoords), this.board[nextCoords[0]][nextCoords[1]][nextCoords[2]]);
                let tup = [direction, nextState]
                returnTuples[i] = tup; 
            }else if(direction === "forward"){
                let nextCoords = [...currCoords];
                nextCoords[1] -= 1; 
                let nextState = new MazeState(JSON.stringify(nextCoords), this.board[nextCoords[0]][nextCoords[1]][nextCoords[2]]);
                let tup = [direction, nextState]
                returnTuples[i] = tup; 
            }else if(direction === "backward"){
                let nextCoords = [...currCoords];
                nextCoords[1] += 1; 
                let nextState = new MazeState(JSON.stringify(nextCoords), this.board[nextCoords[0]][nextCoords[1]][nextCoords[2]]);
                let tup = [direction, nextState]
                returnTuples[i] = tup; 
            }else if(direction === "up"){
                let nextCoords = [...currCoords];
                nextCoords[0] += 1; 
                let nextState = new MazeState(JSON.stringify(nextCoords), this.board[nextCoords[0]][nextCoords[1]][nextCoords[2]]);
                let tup = [direction, nextState]
                returnTuples[i] = tup; 
            }else if(direction === "down"){
                let nextCoords = [...currCoords];
                nextCoords[0] -= 1; 
                let nextState = new MazeState(JSON.stringify(nextCoords), this.board[nextCoords[0]][nextCoords[1]][nextCoords[2]]);
                let tup = [direction, nextState]
                returnTuples[i] = tup; 
            }
        }

        return returnTuples;
    }

}

export default MazeDomain