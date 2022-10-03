import Maze3dGenerator from "./maze-3d-generator.js";
import SimpleMaze3dGenerator from "./maze-3d-generator-simple.js"; 
import Maze3d from "./maze-3d-class.js";
import SearchDemo from "./search-demo.js";
import DFSMaze3dGenerator from "./maze-3d-gen-dfs.js";
import Sidewinder3dGen from "./maze-3d-gen-sidewinder.js";




// let newMaze = new Maze3d(3, 5); 
// console.log(newMaze.board);
// console.log("start: " + newMaze.board.start);

let simpleMazeAlgoTester = new SimpleMaze3dGenerator(20, 20);
console.log("SIMPLE MAZE GENERATION TIME: ") 
console.log(simpleMazeAlgoTester.measureAlgorithmTime()) 

let dfsMazeTester = new DFSMaze3dGenerator(20, 20);
console.log("DFS MAZE GENERATION TIME: ") 
console.log(dfsMazeTester.measureAlgorithmTime()) 

let sideWinderTester = new Sidewinder3dGen(20, 20); 
console.log("SIDEWINDER MAZE GENERATION TIME: ") 
console.log(sideWinderTester.measureAlgorithmTime()) 

let searchDemo = new SearchDemo(); 
searchDemo.run(3, 5);
