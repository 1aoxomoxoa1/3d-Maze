import Maze3dGenerator from "./maze-3d-generator.js";
import SimpleMaze3dGenerator from "./maze-3d-generator-simple.js"; 
import Maze3d from "./maze-3d-class.js";

let mazeEz = [
    [[1, 0, 1, 0],
     [1, 0, 1, 0],
     [1, 0, 1, 0],
    [1, 1, 0, 0]],  

    [[1, 0, 1, 0],
     [1, 0, 1, 0],
     [1, 0, 1, 0],
    [1, 1, 0, 0]]]

console.log(mazeEz[0][0][0]);


function testingTimes(){
    let currTime = Date.now(); 
    
    setTimeout(() => {
        const millis = Date.now() - currTime;
    
        console.log(millis);
        console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);
        // expected output: seconds elapsed = 2
    }, 2000);
}

testingTimes();


let newMaze = new Maze3d(3, 5); 
console.log(newMaze.board);


console.log(newMaze.toString());

console.log("|↕| | ↕ |");