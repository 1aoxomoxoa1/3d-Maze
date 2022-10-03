class Cell{
    static directions = {
        left: 0, //LEFT SAME LEVEL
        right: 1, //RIGHT SAME LEVEL
        forward: 2, //UP SAME LEVEL
        backward: 3, //DOWN SAME LEVEL
        up: 4, //UP A LEVEL (+1)
        down: 5 //DOWN A LEVEL (-1)
    }

    constructor(coordsList){ 
        this.moves = new Array(6).fill(0); 
        this.start = undefined;
        this.goal = undefined; 
        this.coords = coordsList;
    }

    //**
    //  * 
    //  * @param {*} direction -- string "left", "right", specify direction we want to give a value
    //  * @param {*} boolValue -- true if allowed to move from this cell in direction ; false if not
    //  */
    addValue(direction, boolValue,){
        this.moves[Cell.directions[direction]] = boolValue;
    }

    //**
    //  * 
    //  * @param {*} direction input parameter
    //  * @returns bool -- true: if there is a wall (or move can be made) in certain direction; false: if cant make move
    //  */
    getBoolValue(direction){
        let idx = Cell.directions[direction];
        return this.moves[idx];
    }


    //**
    //  * 
    //  * @param {*} property -- property of current cell we want to update
    //  * @param {*} boolValue -- boolValue we want to set at (either way we check if neighbor out of bound)
    //  * @param {*} coords -- coords of cell we are updating from
    //  * @param {*} n  -- nxn parameter
    //  * @param {*} level -- level paremeter
    //  * @param {*} board -- so we can get other cell to update
    //  *THIS CELL WILL BREAK THE WALL BETWEEN TWO CELLS, USED IN CARVING THE PATH ,
    //  *SO WE DONT HAVE TO CALL addValue TWICE
    updateCells(property, boolValue, coords, board){
        let z, y, x; 
        [z, y, x] = coords; 
        let currCell = board[z][y][x];


        if(property === "left"){
            let nextCoords = [...coords];
            nextCoords[2] -= 1; 
            currCell.addValue("left", boolValue);
            let nextCell = board[nextCoords[0]][nextCoords[1]][nextCoords[2]];
            nextCell.addValue("right", boolValue); 
        }else if(property === "right"){
            let nextCoords = [...coords];
            nextCoords[2] += 1; 
            currCell.addValue("right", boolValue);
            let nextCell = board[nextCoords[0]][nextCoords[1]][nextCoords[2]];
            nextCell.addValue("left", boolValue); 
        }else if(property === "forward"){
            let nextCoords = [...coords];
            nextCoords[1] -= 1; 
            currCell.addValue("forward", boolValue);
            let nextCell = board[nextCoords[0]][nextCoords[1]][nextCoords[2]];
            nextCell.addValue("backward", boolValue); 
        }else if(property === "backward"){
            let nextCoords = [...coords];
            nextCoords[1] += 1; 
            currCell.addValue("backward", boolValue);
            let nextCell = board[nextCoords[0]][nextCoords[1]][nextCoords[2]];
            nextCell.addValue("forward", boolValue); 
        }else if(property === "up"){
            let nextCoords = [...coords];
            nextCoords[0] += 1; 
            currCell.addValue("up", boolValue);
            let nextCell = board[nextCoords[0]][nextCoords[1]][nextCoords[2]];
            nextCell.addValue("down", boolValue); 
        }else if(property === "down"){
            let nextCoords = [...coords];
            nextCoords[0] -= 1; 
            currCell.addValue("down", boolValue);
            let nextCell = board[nextCoords[0]][nextCoords[1]][nextCoords[2]];
            nextCell.addValue("up", boolValue); 
        }
    }
}

export default Cell; 