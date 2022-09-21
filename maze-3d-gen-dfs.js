import Maze3dGenerator from "./maze-3d-generator.js";
import Cell from "./cell-class.js";


class DFSMaze3dGenerator extends Maze3dGenerator{

    constructor(levels, n){
        super(); 
        this.levels = levels; 
        this.n = n; 
    }


    carvePath(board){
        let floors = this.levels;
        let n = this.n;
        

        //get two random coordinated for board[z][y][x]
        //z: floor , y: row , x: col
        //start & finish are like [2, 0, 1]
        let start = [Math.floor(Math.random() * this.levels), Math.floor(Math.random() * this.n), Math.floor(Math.random() * this.n)]
        let finish = [Math.floor(Math.random() * this.levels), Math.floor(Math.random() * this.n), Math.floor(Math.random() * this.n)]
        console.log(start);
        console.log(finish);


        //get the path with the dfs
        let path = []; 
        path = this.dfs(start, finish, path, board);
        console.log(path);

        for(let i = 0; i < path.length - 1; i++){
            //get the coordinates for current and next step in path ; and current cell itself
            //we will break a wall in the currentCell  at the direction indicated of the the next step in the path 
            //also need to break a wall in the nextCell to mirror the other wall broken            
            let currZ, currY, currX;
            let nextZ, nextY, nextX; 

            [currZ, currY, currX] = path[i]; 
            [nextZ, nextY, nextX] = path[i + 1];

            let currCell = board[currZ][currY][currX];

            //setting the property values for start and end
            if(i === 0){
                currCell.start = true;
            }else if(i === path.length - 2){
                let nextCell = board[nextZ][nextY][nextX];
                nextCell.goal = true; 
                break; //no need to update walls because there is no cell after the goal cell
            }


            if(nextZ !== currZ){ //if there is a difference in Z : floor change (up or down)
                let difference = nextZ - currZ;
                if(difference === 1){
                    currCell.updateCells('up', true, [currZ, currY, currX], board); 
                }else if(difference === -1){
                    currCell.updateCells('down', true, [currZ, currY, currX], board);
                } 
            }else if(nextY !== currY){ //if there is a difference in X: row change (forward or backward)
                let difference = nextY - currY; 
                if(difference === 1){
                    currCell.updateCells('backward', true, [currZ, currY, currX], board);
                }else if(difference === -1){
                    currCell.updateCells('forward', true, [currZ, currY, currX], board);
                } 
            }else if(nextX !== currX){//if there is a difference in Y: col change (left or right)
                let difference = nextX - currX; 
                if(difference === 1){
                    currCell.updateCells('right', true, [currZ, currY, currX], board);
                }else if(difference === -1){
                    currCell.updateCells('left', true, [currZ, currY, currX], board);
                } 
            }
            

        }

    }

    dfs(start, finish, path, board){

        let stack = []; 

        //CHANGE VISITED TO A SET 
        let visited = new Set(); 

        stack.push(start); //[z, y, x]
        visited.add(JSON.stringify(start)); 

        let current = start; 

        while (stack.length !== 0){
            
            //-------not sure if this needed ---------------
            // testCurrent = [...current]; //copy the current
            //----------------------------------------------   
            
            //when the current coords are equal to the finish coords
            if(JSON.stringify(current) === JSON.stringify(finish)){
                return stack; 
            } 
            
            //get unvisited Neighbors of current that are in valid locations
            //will be cell coordinates themselves: i.e. if current = [0, 0, 0] --> [0, 0 ,1], [1, 0, 0], [0, 1, 1]
            let unvisitedNeighbors = this.getUnvisitedNeighbors(current, visited); 
            
            if(unvisitedNeighbors.length > 0){
                //assigns current to the random neighbor
                let neighbor = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)]; //gets random neighbor
                current = neighbor; 

                //pushes into stack and visited
                stack.push(current);
                visited.add(JSON.stringify(current));
            }else{
                current = stack.pop();
            }

        }
    }

    //**
    //  * 
    //  * @param {array} current -- array [z, y, x] index that we want neighbors of
    //  * @param {set} visited -- set containing JSON.stringified coordinates that we have visited in DFS
    //  * @returns {array} containing indexes conataining unvisited neighbors 
    //  */
    getUnvisitedNeighbors(current, visited){
        let directions = [[0, 0, -1], [0, 0, 1], [0, -1, 0], [0, 1, 0], [1, 0, 0], [-1, 0, 0]];
        let neighbors = []; 

        for(const direction of directions){
            let testCopy = [...current]; 
            testCopy[0] += direction[0]; 
            testCopy[1] += direction[1]; 
            testCopy[2] += direction[2];  

            //if index is valid and 
            //visited does not include the direction
            //WILL INDEX VALID HAVE ACCESS TO this.n and this.levels? 
            if(this.indexValid(testCopy) && visited.has(JSON.stringify(testCopy)) !== true){
                neighbors.push(testCopy); 
            }
        }

        return neighbors;
    }
}

export default DFSMaze3dGenerator;