import DFSMaze3dGenerator from "./maze-3d-gen-dfs.js";
import SimpleMaze3dGenerator from "./maze-3d-generator-simple.js";
import Sidewinder3dGen from "./maze-3d-gen-sidewinder.js";

class Maze3d{

    // "dfs" for dfs || "sidewinder" for sidewinder || "simple" for simple
    constructor(levels, n, algo){
        //mazeGenerator will generate the board (matrix) within the constructor
        //this.board will also have properties .start and .goal with the coords 
        if(algo === "dfs"){
            let mazeGenerator = new DFSMaze3dGenerator(levels, n);
            this.board = mazeGenerator.generate();
        }else if(algo === "sidewinder"){
            let mazeGenerator = new Sidewinder3dGen(levels, n);
            this.board = mazeGenerator.generateSidewinder(); 
        }else if(algo === "simple"){
            let mazeGenerator = new SimpleMaze3dGenerator(levels, n);
            this.board = mazeGenerator.generate();
        }

        //additional properties 
        this.levels = levels
        this.n = n; 
    }

    toString(){
        let returnStr = ""; 
        let  headerFooter = new Array(this.n * 2).join('-');

        for(let z = 0; z < this.levels; z++){
            returnStr += `Level: ${z}\n\n`;
            returnStr += ` ${headerFooter} \n`;  

            for(let y = 0; y < this.n; y++){
                //each rows footer will display the walls blocking backward and forward
                let row = "|"; 
                let rowFooter = "";
                if(y === this.n - 1){
                    rowFooter += " ";
                }else{
                    rowFooter += "|";
                }
                for(let x = 0; x < this.n; x++){
                    let cell = this.board[z][y][x];

                    //for each cell, we need to check its "up", "down", "right", and "backward" ()
                    let isUp = cell.getBoolValue("up");
                    let isDown = cell.getBoolValue("down");
                    let isRight = cell.getBoolValue("right"); 
                    let isBackward = cell.getBoolValue("backward");

                    if(cell.start === true || cell.goal === true){
                        if(cell.start){
                            row += "S"; 
                        }
                        if(cell.goal){
                            row += "G";
                        }
                    }else{

                        //arrows indicating up // down go first in a cells display
                        if(isUp === true && isDown !== true){
                            row += "↑"; 
                        }else if(isUp !== true && isDown === true){
                            row += "↓"; 
                        }else if(isUp === true && isDown === true){
                            row += "↕";
                        }else{
                            row += " "; 
                        }
                    } 


                    
                    //checking for if we need a wall with isRight
                    if(isRight === false){
                        row += "|";
                    }else{
                        row += " "; 
                    }

                    //checking how we form the rowFooter
                    if(y === this.n - 1){
                        if(x === this.n - 1){
                            rowFooter += "-";
                        }else{
                            rowFooter += "--"
                        }
                    }else{
                        if(isBackward === false){
                            rowFooter += "-"; 
                        }else if(isBackward === true){
                            rowFooter += " ";
                        }
                        if(x === this.n-1){
                            rowFooter += "|";
                        }else{
                            rowFooter += "+";
                        }
                    }
                }
                row += "\n";
                rowFooter += "\n";
                returnStr += row; 
                returnStr += rowFooter; 
            }

            //for the space between levels in the display !!
            returnStr += "\n\n";

        }
        return returnStr;
    }

}


export default Maze3d; 