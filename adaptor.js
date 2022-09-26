import BreadthFirstSearch from "./search-algorithms/breadth-first-search-algo.js";
import DepthFirstSearch from "./search-algorithms/depth-first-search-algo.js";
import Searchable from "./searchable.js";

class Adapter{

    //**
    //  * 
    //  * @param {*} Maze -- instance of 3dMaze
    //  * @param {*} searchAlgo -- specify which search algorithm we will use, will initialize with this specification
    //  */
    constructor(maze){
        this.maze = maze;
    }

    convertToSearch(){

        //each search algo needs at LEAST start and goal coordinates and the board
        let startCoords = this.getStartCoords();
        let goalCoords = this.getGoalCoords(); 
        let board = this.maze.board;
        let search; 

        if(searchAlgo === "breadthFirstSearch"){
            search = new BreadthFirstSearch(startCoords, goalCoords, board);
        }else if(searchAlgo === "depthFirstSearch"){
            search = new DepthFirstSearch(startCoords, goalCoords, board);
        }else if(searchAlgo === "aStar"){
            //-------HANDLE--------
            search = "ASTAR"; 
        }

        return search;
    }

    //**
    //  * FUNCTION WILL LOOK AT THE BOARD OF 3dMAZE AND RETURN WHERE THE START AND FINISH COORDINATES ARE LOCATED 
    //  *
    //  * @returns startCoords --> [z, y , x]
    //  */
    getStartCoords(){
        return this.maze.board.start; 
    }

    //**
    //  * 
    //  * @returns goalCoords --> [z, y , x]
    //  */
    getGoalCoords(){
        return this.maze.board.goal; 
    }

}

export default Adapter;