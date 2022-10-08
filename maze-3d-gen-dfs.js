import Maze3dGenerator from "./maze-3d-generator.js";
import Cell from "./cell-class.js";
import Node from "./node.js";

class DFSMaze3dGenerator extends Maze3dGenerator{

    constructor(levels, n){
        super(); 
        this.levels = levels; 
        this.n = n; 
    }

    //**
    //  * 
    //  * @returns a board , this function is used when constructing the Maze3d object 
    //  */
    generate2(){

        let board = new Array(this.levels).fill(0);

        for(let z = 0; z < this.levels; z++){

            //start with level 
            let level = new Array(this.n).fill(0);

            for(let y = 0; y < this.n; y++){ //rows of the level
                let row = new Array(this.n).fill(0);

                for(let x = 0; x < this.n; x++){ //cols of the level (individual cells)

                    let myCell = new Cell([z, y, x]); 


                    for(let property in Cell.directions){
                        // 1) we need to check for same row, prior_cell.right and set === to currCell.left 
                        // 2) we need to check for the last row, cellForward.backward and set === currCell.forward
                        // 3) we need to check the floor up (same row[y], col[x]) ~ cellUp.down and set === currCell.up 
                        let boolValue = undefined; 

                        if(this.propertyIndexInvalid(z, y, x, property, this.n, this.levels)){ 
                            myCell.addValue(property, false); 
                        }else{
                            if(property === 'left'){ //will check on every 'left' except, those in first [0th] col
                                let leftCell = row[x - 1];
                                boolValue = leftCell.getBoolValue('right'); 
                            }else if(property === 'forward'){//checks every 'forward' except, those in first [0th] row
                                let rowAbove = level[y - 1]; 
                                let forwardCell = rowAbove[x]; 
                                boolValue = forwardCell.getBoolValue('backward'); 
                            }else if(property === 'down'){ //checks every 'down', except those in first level, z = 0, 
                                let floorAbove = board[z - 1];
                                let cellLevelAbove = floorAbove[y][x];
                                boolValue = cellLevelAbove.getBoolValue('up');
                            }else{
                                boolValue = (Math.floor(Math.random() * 2) === 0) ? true : false; //otherwise randomize bool value
                            }
                            myCell.addValue(property, boolValue);
                        }
                    }
                    row[x] = myCell;  
                }

                level[y] = row;
            }

            board[z] = level; 
        }

        this.carvePath(board); 
        return board; 
    }

    generate(){
        let board = new Array(this.levels).fill(0);

        //make board of all zeros
        for(let z = 0; z < this.levels; z++){

            //start with level 
            let level = new Array(this.n).fill(0);

            for(let y = 0; y < this.n; y++){ //rows of the level
                let row = new Array(this.n).fill(0);

                for(let x = 0; x < this.n; x++){ //cols of the level (individual cells)

                    let myCell = new Cell([z, y, x]); 
                    row[x] = myCell;  
                }

                level[y] = row;
            }

            console.log(level);
            board[z] = level; 
        }

        
        //iterate over all the cells and set moves arr to falses
        for(let z = 0; z < this.levels; z++){
            for(let y = 0; y < this.n; y++){
                for(let x = 0; x < this.n; x++){
                    for(let property in Cell.directions){

                        let myCell = board[z][y][x];

                        if(this.propertyIndexInvalid(z, y, x, property, this.n, this.levels)){ 
                            myCell.addValue(property, false); 
                        }else{
                            myCell.updateCells(property, false, [z, y, x], board);
                        }
                    }
                }
            }
        }

        this.carvePath(board); 
        return board; 
    }

    carvePath(board){
        let floors = this.levels;
        let n = this.n;
        

        //get two random coordinated for board[z][y][x]
        //z: floor , y: row , x: col
        //start & finish are like [2, 0, 1]
        let start = [Math.floor(Math.random() * this.levels), Math.floor(Math.random() * this.n), Math.floor(Math.random() * this.n)]
        let finish = [Math.floor(Math.random() * this.levels), Math.floor(Math.random() * this.n), Math.floor(Math.random() * this.n)]
        
        // console.log(start);
        // console.log(finish);

        //setting start and goal position for the board
        let startCell = board[start[0]][start[1]][start[2]];
        startCell.start = true; 
        board.start = startCell; 
        let goalCell = board[finish[0]][finish[1]][finish[2]];
        goalCell.goal = true; 
        board.goal = goalCell;

        //get the path with the dfs
        this.dfsCarveThrough(start, board);
        this.dfsCarveTo(start, finish, board);
      
        // console.log(path);

    //     for(let i = 0; i <= path.length - 1; i++){
    //         //get the coordinates for current and next step in path ; and current cell itself
    //         //we will break a wall in the currentCell  at the direction indicated of the the next step in the path 
    //         //also need to break a wall in the nextCell to mirror the other wall broken            
    //         let currZ, currY, currX;
    //         let nextZ, nextY, nextX; 

    //         [currZ, currY, currX] = path[i]; 

    //         if(i !== path.length - 1){
    //             [nextZ, nextY, nextX] = path[i + 1];
    //         } 

    //         let currCell = board[currZ][currY][currX];

    //         //setting the property values for start and end
    //         if(i === 0){
    //             currCell.start = true;
    //             board.start = board[currZ][currY][currX]; 
    //         }else if(i === path.length - 1){
    //             currCell.goal = true; 
    //             board.goal = currCell;
    //             break; //no need to update walls because there is no cell after the goal cell
    //         }


    //         if(nextZ !== currZ){ //if there is a difference in Z : floor change (up or down)
    //             let difference = nextZ - currZ;
    //             if(difference === 1){
    //                 currCell.updateCells('up', true, [currZ, currY, currX], board); 
    //             }else if(difference === -1){
    //                 currCell.updateCells('down', true, [currZ, currY, currX], board);
    //             } 
    //         }else if(nextY !== currY){ //if there is a difference in X: row change (forward or backward)
    //             let difference = nextY - currY; 
    //             if(difference === 1){
    //                 currCell.updateCells('backward', true, [currZ, currY, currX], board);
    //             }else if(difference === -1){
    //                 currCell.updateCells('forward', true, [currZ, currY, currX], board);
    //             } 
    //         }else if(nextX !== currX){//if there is a difference in Y: col change (left or right)
    //             let difference = nextX - currX; 
    //             if(difference === 1){
    //                 currCell.updateCells('right', true, [currZ, currY, currX], board);
    //             }else if(difference === -1){
    //                 currCell.updateCells('left', true, [currZ, currY, currX], board);
    //             } 
    //         }
            

    //     }

    }


    // //**
    //  * 
    //  * @param {array} start -- coords [z, y, x]
    //  * @param {array} finish -- finish coords [z, y, x]
    //  * @param {array} path 
    //  * @param {*} board 
    //  * @returns path
    //  */
    dfsCarveThrough(start, board){

        let stack = []; 

        //CHANGE VISITED TO A SET 
        let visited = new Set(); 

        let startNode = new Node(undefined, start, "initial");
        stack.push(startNode); 
        visited.add(JSON.stringify(start)); 

        let current = startNode; 

        while (stack.length !== 0){
            
            // //when the current coords are equal to the finish coords
            // if(JSON.stringify(current.state) === JSON.stringify(finish)){
            //     path = this.getDFSPath(current); 
            //     return path; 
            // } 
            
            //get unvisited Neighbors of current that are in valid locations
            //will be cell coordinates themselves: i.e. if current = [0, 0, 0] --> [0, 0 ,1], [1, 0, 0], [0, 1, 1]
            let unvisitedNeighbors = this.getUnvisitedNeighbors(current.state, visited); 
            
            if(unvisitedNeighbors.length > 0){

                //assigns current to the random neighbor
                let neighbor = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)]; //gets random neighbor
                
                this.removeWalls(current.state, neighbor, board);

                let neighborNode = new Node(current, neighbor, "direction"); 
                current = neighborNode; 

                //pushes into stack and visited
                stack.push(current);
                visited.add(JSON.stringify(current.state));
            }else{
                current = stack.pop();
            }

        }
    }

    // //**
    //  * 
    //  * @param {array} start -- coords [z, y, x]
    //  * @param {array} finish -- finish coords [z, y, x]
    //  * @param {array} path 
    //  * @param {*} board 
    //  * @returns path
    //  */
    dfsCarveTo(start, finish, board){

        let stack = []; 

        //CHANGE VISITED TO A SET 
        let visited = new Set(); 

        let startNode = new Node(undefined, start, "initial");
        stack.push(startNode); 
        visited.add(JSON.stringify(start)); 

        let current = startNode; 

        while (stack.length !== 0){
            
            //when the current coords are equal to the finish coords
            if(JSON.stringify(current.state) === JSON.stringify(finish)){
                // path = this.getDFSPath(current); 
                // return path; 
                return
            } 
            
            //get unvisited Neighbors of current that are in valid locations
            //will be cell coordinates themselves: i.e. if current = [0, 0, 0] --> [0, 0 ,1], [1, 0, 0], [0, 1, 1]
            let unvisitedNeighbors = this.getUnvisitedNeighbors(current.state, visited); 
            
            if(unvisitedNeighbors.length > 0){

                //assigns current to the random neighbor
                let neighbor = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)]; //gets random neighbor
                
                this.removeWalls(current.state, neighbor, board);

                let neighborNode = new Node(current, neighbor, "direction"); 
                current = neighborNode; 

                //pushes into stack and visited
                stack.push(current);
                visited.add(JSON.stringify(current.state));
            }else{
                current = stack.pop();
            }

        }
    }

    removeWalls(coords1, coords2, board){
        let currZ, currY, currX;
        let nextZ, nextY, nextX; 

        [currZ, currY, currX] = coords1; 
        [nextZ, nextY, nextX] = coords2; 

        let currCell = board[currZ][currY][currX];

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


    getDFSPath(currNode){
        let path = [];
        
        while(currNode.parent !== undefined){
            path.push(currNode.state);
            currNode = currNode.parent; 
        }

        path.push(currNode.state);

        //path is in reverse, so reverse it
        path.reverse();

        return path;
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