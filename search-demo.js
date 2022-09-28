import Cell from "./cell-class.js";
import Maze3d from "./maze-3d-class.js";
import MazeDomain from "./maze-domain.js";
import MinHeap from "./priority-q-min-heap.js";
import BreadthFirstSearch from "./serach-algorithms/breadth-first-search-algo.js";
import DepthFirstSearch from "./serach-algorithms/depth-first-search-algo.js";
import MazeState from "./state-maze.js";
import State from "./state.js";
import Node from "./node.js"
import AStar from "./serach-algorithms/a-star-algo.js";

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
        let myMaze3d = new Maze3d(levels, n, "dfs");
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

        //SOLVING WITH A STAR
        console.log("3) A STAR SOLUTIONS");
        let myAStar = new AStar();
        let aStarSolutionPath = this.testSearchAlgorithm(myAStar, mazeDomain);
        console.log(aStarSolutionPath);
        console.log("Number of nodes visited by A*: " + myAStar.nodesVisited);
        // (c) Prints the number of states that have been visited by each algorithm (you will have to generate large enough mazes to see the difference).



        console.log("TESTING \n ------------------------------------")
        //------------------------------------
        //TESTING THE PRIORITY QUEUE - MIN HEAP
        let queue = new MinHeap();

        let cell1 = new Cell([1, 2, 3]);
        let state1 = new MazeState("[1, 2, 3]", cell1);
        let node1 = new Node(undefined, state1, "left", 10); 

        let cell2 = new Cell([1, 2, 4]);
        let state2 = new MazeState("[1, 2, 4]", cell2);
        let node2 = new Node(undefined, state2, "right", 14); 


        let cell3 = new Cell([1, 3, 3]);
        let state3 = new MazeState("[1, 3, 3]", cell3);
        let node3 = new Node(undefined, state3, "forward", 8);
        

        let cell4 = new Cell([1, 1, 3]);
        let state4 = new MazeState("[1, 1, 3]", cell4);
        let node4 = new Node(undefined, state4, "backward", 9);
  
        let cell5 = new Cell([1, 0, 3]);
        let state5 = new MazeState("[1, 0, 3]", cell5);
        let node5 = new Node(undefined, state5, "forward", 11);

        queue.insert(node1); 
        queue.insert(node2); 
        queue.insert(node3); 
        queue.insert(node4); 
        console.log(queue);
        console.log("MIN: " + queue.removeMin().pathCost);
        queue.insert(node5); 
        console.log(queue);

        let queueKeys = new Set(queue.storage.map(node => node.state.key));
        console.log(queueKeys);

    }

    testSearchAlgorithm(searchAlgo, searchable) {
        let solution = searchAlgo.search(searchable);
        return solution
    }

}

export default SearchDemo;