import Maze3dGenerator from "./maze-3d-generator.js";
import Cell from "./cell-class.js";

class SimpleMaze3dGenerator extends Maze3dGenerator{
    
    //**
    //  * 
    //  * @param {int} levels-- number of levels in board [first index]
    //  * @param ints n -- n x n size of each level of maze 
    //               
    //               mat[level_num][row_num][col_num]
    //  */
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
        path = this.pathFinder(start, finish, start, path);
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
                board.start = currCell; 
            }else if(i === path.length - 2){
                let nextCell = board[nextZ][nextY][nextX];
                nextCell.goal = true; 
                board.goal = nextCell; 
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

    

    //**
    //  * 
    //  * @param {*} before -- coordinates [z,y,x] before the move we are testing
    //  * @param {*} after -- coordinates [z,y,x] after the move we are testing
    //  * @param {*} finish -- coordinates we want to finish at 
    //  * RETURN - {bool} True: if after is closer to the finish point; False if not or is invalid
    //  */
    isCloser(before, after, finish){
        let zBefore, yBefore, xBefore;
        [zBefore, yBefore, xBefore] = before;

        let zAfter, yAfter, xAfter;
        [zAfter, yAfter, xAfter] = after; 

        //checks if after the move the coordinates are OFF THE BOARD, then move is automatically BAD
        if(zAfter < 0 || zAfter >= this.levels){ 
            return false; 
        }else if(yAfter < 0 || yAfter >= this.n){
            return false; 
        }else if(xAfter < 0 || xAfter >= this.n){
            return false; 
        }

        //check zDiffBefore, zDiffAfter, yDiffBefore, yDiffAfter, xDiffBefore, XDiffAfter -- difference between finish and coordinate
        //one of the pairs should have a different value and trigger if
        let zDiffBefore = Math.abs(zBefore - finish[0]);
        let yDiffBefore = Math.abs(yBefore - finish[1]);
        let xDiffBefore = Math.abs(xBefore - finish[2]);
        
        let zDiffAfter = Math.abs(zAfter - finish[0]); 
        let yDiffAfter = Math.abs(yAfter - finish[1]); 
        let xDiffAfter = Math.abs(xAfter - finish[2]);

        if(zDiffAfter < zDiffBefore || yDiffAfter < yDiffBefore || xDiffAfter < xDiffBefore){
            return true;
        }else{
            return false;
        }


    }


    //**
    //  * 
    //  * @param {*} start-- start coordinates [z,y,x] - [floor, row, col]
    //  * @param {*} finish-- finish coordinates [z,y,x] - [floor, row, col]
    //  * @param {*} current -- current coordinates [z,y,x] - [floor, row, col]
    //  * @param {*} path-- array of arrays displaying the correct path
    //  * @returns {array} path -- array of paths showing the random path to carve
    //  * THIS FUNCTION FINDS A PATH OF RANDOM COORDINATES THAT GET CLOSER TO THE GOAL WITH EACH MOVE
    //  */
    pathFinder(start, finish, current, path){
        if(current === finish){
            return path; 
        }

        path.push(current);

        let currentCopy = [...current];

        //directions = left, right, forward, backward, up, down 
        let directions = [[0, 0, -1], [0, 0, 1], [0, -1, 0], [0, 1, 0], [1, 0, 0], [-1, 0, 0]];
        let tried = new Set(); //stores the direction tried for each node for efficiency

        while(JSON.stringify(current) !== JSON.stringify(finish)){
            currentCopy = [...current]; //copy the current 
            let direction = directions[Math.floor(Math.random() * directions.length)]; //get random direciton
            if(tried.has(JSON.stringify(direction))){
                continue; 
            }
            currentCopy[0] += direction[0]; 
            currentCopy[1] += direction[1]; 
            currentCopy[2] += direction[2];       

            if(this.isCloser(current, currentCopy , finish)){
                path.push(currentCopy); 
                current = [...currentCopy];
                tried.clear();
            }else{
                tried.add(JSON.stringify(direction));
            }
        }

        return path; 
    }

}



export default SimpleMaze3dGenerator;