import Maze3dGenerator from "./maze-3d-generator.js";
import SimpleMaze3dGenerator from "./maze-3d-generator-simple.js"; 
import Maze3d from "./maze-3d-class.js";
import SearchDemo from "./search-demo.js";




// let newMaze = new Maze3d(3, 5); 
// console.log(newMaze.board);
// console.log("start: " + newMaze.board.start);

// let simpleMazeAlgoTester = new SimpleMaze3dGenerator(3, 5); 
// console.log(simpleMazeAlgoTester.measureAlgorithmTime()) 

// console.log(newMaze.toString());

let searchDemo = new SearchDemo(); 
searchDemo.run(3, 5);
