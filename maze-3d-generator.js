import Cell from "./cell-class.js";


class Maze3dGenerator{

    // static directions = {
    //     "LEFT": 0, //LEFT SAME LEVEL
    //     "RIGHT": 1, //RIGHT SAME LEVEL
    //     "FORWARD": 2, //UP SAME LEVEL 
    //     "BACKWARD": 3, //DOWN SAME LEVEL
    //     "UP": 4, //UP A FLOOR
    //     "DOWN": 5 //DOWN A FLOOR
    // }

    constructor() {
        if (this.constructor === Maze3dGenerator) {
            throw new Error('Abstract class Maze3dGenerator cannot be instantiated');
        }
    
    }

    //**
    //  * 
    //  * @returns a board , this function is used when constructing the Maze3d object 
    //  */
    generate(){

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

            console.log(level);
            board[z] = level; 
        }

        this.carvePath(board); 
        return board; 
    }


    measureAlgorithmTime(){
        let currTime = Date.now(); 
        let testObj = this.generate(); 
        let endTime = Date.now(); 
    
        let milliSecondsDifference = currTime - endTime; //can concert to seconds with Math.floor(millis / 1000)
    }

    propertyIndexInvalid(level, row, col, property, size, levels){
        //used in filling the board, sets the initial moves valid for a given board
        //will return true if the index is NOT VALID, then cell[propertyIdx] is set at false
        
        if(property === "left"){
            if(col === 0){
                return true; 
            }else{
                return false; 
            }
        }else if(property === "right"){
            if(col === size - 1){
                return true; 
            }else{
                return false;
            }
        }else if(property === "forward"){
            if(row === 0){
                return true; 
            }else{
                return false; 
            }
        }else if(property === "backward"){
            if(row === size - 1){
                return true; 
            }else{
                return false;
            }
        }else if(property === "up"){
            if(level === levels - 1){
                return true;
            }else{
                return false;
            }
        }else if(property === "down"){
            if(level === 0){
                return true;
            }else{
                return false;
            }
        }
    }

    //**
    //  * 
    //  * @param {array} array of coordinates to a cell [z, y, x]
    //  * @return {bool} True if the move is to a valid index; False if not
    indexValid(cellCoords){
        let z, y, x; 
        [z, y, x] = cellCoords; 

        if(z < 0 || z >= this.levels){ 
            return false; 
        }else if(y < 0 || y >= this.n){
            return false; 
        }else if(x < 0 || x >= this.n){
            return false; 
        }
        
        return true;
    }
}



export default Maze3dGenerator; 