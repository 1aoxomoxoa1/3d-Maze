import Cell from "./cell-class.js";
import Maze3d from "./maze-3d-class.js";
import MazeDomain from "./maze-domain.js";
import BreadthFirstSearch from "./serach-algorithms/breadth-first-search-algo.js";
import DepthFirstSearch from "./serach-algorithms/depth-first-search-algo.js";
import MazeState from "./state-maze.js";
import State from "./state.js";


class SearchDemo{
    constructor(){

    }

    //**
    //  * 
    //  * @param {*} levels -- specifies the levels of the maze
    //  * @param {*} n -- specifies the size of nxn row x col 
    //  */
    run(levels, n){

        //(a) Generates a 3D maze using DFSMaze3dGenerator. --> I set DFSMaze3dGenerator in constructor of 3dMaze
        let myMaze3d = new Maze3d(levels, n);
        console.log(myMaze3d.toString());

        // (b) Solves this maze using the three search algorithms.
            //--need an adaptor to convert the maze to search problems 
        let mazeDomain = new MazeDomain(myMaze3d);
        console.log("initial")
        console.log(mazeDomain.initial);
        console.log("goal")
        console.log(mazeDomain.goal);
        console.log(mazeDomain.board);
        console.log("key as string: " + mazeDomain.goal.key);

        //SOLVING WITH DFS
        console.log("1) DFS SOLUTIONS")
        let myDFS = new DepthFirstSearch(); 
        let dfsSolutionPath = this.testSearchAlgorithm(myDFS, mazeDomain);
        console.log(dfsSolutionPath);
        console.log("Number of nodes visited by DFS: " + myDFS.nodesVisited);

        //SOLVING WITH BFS
        console.log("2) BFS SOLUTIONS");
        let myBFS = new BreadthFirstSearch();
        let bfsSolutionPath = this.testSearchAlgorithm(myBFS, mazeDomain); 
        console.log(bfsSolutionPath);
        console.log("Number of nodes visited by BFS: " + myBFS.nodesVisited);

        // let bfsSearch = myAdaptor.convertToSearch("breadthFirstSearch");


        // (c) Prints the number of states that have been visited by each algorithm (you will have to generate large enough mazes to see the difference).

    }

    testSearchAlgorithm(searchAlgo, searchable) {
        let solution = searchAlgo.search(searchable);
        return solution
    }

}

export default SearchDemo;