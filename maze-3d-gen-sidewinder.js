import Maze3dGenerator from "./maze-3d-generator.js";
import Cell from "./cell-class.js";

class Sidewinder3dGen extends Maze3dGenerator{
    
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

    generateSidewinder(){

        let board = new Array(this.levels).fill(0);

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
        console.log(start);
        console.log(finish);

        //set the start and end properties
        board[start[0]][start[1]][start[2]].start = true
        board[finish[0]][finish[1]][finish[2]].goal = true; 
        board.start = board[start[0]][start[1]][start[2]]; 
        board.goal = board[finish[0]][finish[1]][finish[2]];


        //path is carved with pathfinder algorithm, no need to redo here 
        this.sideWinder(board, 3);
    }


    //**
    //  * 
    //  * @param {*} path 
    //  * @param {*} board 
    //  * @param {*} maxRun -- determines the MAX size of the passage for horizontal run 
    //  */
    sideWinder(board, maxRun = this.n){


        for(let z = 0; z < this.levels; z++){

            for(let y = 0; y < this.n; y++){

                for(let x = 0; x < this.n; x++){
                    
                    //makes the top level open on each row
                    if(y === 0){ 
                        if(x === this.n - 1){ //will break if we update in the last col
                            continue;
                        }
                        let currCell = board[z][y][x];
                        currCell.updateCells("right", true, [z, y, x], board);
                    }else{
                        //for each row, we build "runs" that are smaller or equal to maxRun
                        let maxRunSize;
                        if(maxRun + x > this.n){
                            maxRunSize = this.n - x;
                        }else{
                            maxRunSize = maxRun;
                        }
                        
                        //break a wall at a random idx forward and up within the run
                        let runSize = Math.ceil(Math.random() * maxRunSize); 
                        let forwardIdx = x + Math.ceil(Math.random() * runSize) - 1;
                        let upIdx = x + Math.ceil(Math.random() * runSize) - 1;


                        while (runSize !== 0){
                            let currCell = board[z][y][x];
                            if(x === forwardIdx){
                                currCell.updateCells("forward", true, [z, y, x], board);
                            }if(x === upIdx){
                                if(z !== this.levels - 1){
                                    currCell.updateCells("up", true, [z, y, x], board);
                                }
                            }

                            if(runSize === 1){ //if it is the last cell in the "run", build a wall there
                                if(x !== this.n - 1){
                                    currCell.updateCells("right", false, [z, y, x], board);
                                }
                            }else{
                                currCell.updateCells("right", true, [z, y, x], board);
                                x++;
                            }

                            runSize--; 
                        }                   
                    }
                }
            }
        }

    }

} 


export default Sidewinder3dGen