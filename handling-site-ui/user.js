class User{ 
    constructor(initialCoords, name, mazeObj){ 
        this.name = name; 
        this.currCoords = initialCoords;
        this.initialCoords = initialCoords;
        this.mazeObj = mazeObj;
    }

    //**
    //  * 
    //  * @param {str} direction -- representing desired directional move "left" "right" "forward" "backward" "up" "down"
    //  */
    moveUser(keyDirection){
        let currCell = this.mazeObj.board[this.currCoords[0]][this.currCoords[1]][this.currCoords[2]];
        let newCoords;


        //for each direction we need to check: 
            //1) is move valid for cell in specified direction 
        if(keyDirection === "ArrowLeft"){ //left
            if(currCell.moves[0] === true){
                newCoords = [...this.currCoords];
                newCoords[2] -= 1; 
                this.swapSameFloor(this.currCoords, newCoords)
                this.currCoords = newCoords; 
            }else{
                return "Can't move left..."
            }
        }else if(keyDirection === "ArrowRight"){ //right
            if(currCell.moves[1] === true){
                newCoords = [...this.currCoords];
                newCoords[2] += 1; 
                this.swapSameFloor(this.currCoords, newCoords)
                this.currCoords = newCoords; 
            }else{
                return "Can't move right..."
            }
        }else if(keyDirection === "ArrowUp"){ //forward
            if(currCell.moves[2] === true){
                newCoords = [...this.currCoords];
                newCoords[1] -= 1; 
                this.swapSameFloor(this.currCoords, newCoords)
                this.currCoords = newCoords; 
            }else{
                return "Can't move forward same level..."
            }
            
        }else if(keyDirection === "ArrowDown"){ //backward
            if(currCell.moves[3] === true){
                newCoords = [...this.currCoords];
                newCoords[1] += 1; 
                this.swapSameFloor(this.currCoords, newCoords)
                this.currCoords = newCoords; 
            }else{
                return "Can't move backward same level..."
            }
        }else if(keyDirection === "w"){ //up level
            if(currCell.moves[4] === true){
                newCoords = [...this.currCoords]; 
                newCoords[0] += 1; 
                this.currCoords = newCoords; 
                return "floor up";
            }else{
                return "Can't move up a floor..."
            }
        }else if(keyDirection === "s"){ //down level
            if(currCell.moves[5] === true){
                newCoords = [...this.currCoords]; 
                newCoords[0] -= 1; 
                this.currCoords = newCoords; 
                return "floor down";
            }else{
                return "Can't move down a floor..."
            }
        }
    }


    swapSameFloor(prevCoords, newCoords){
        //we are moving icon from prevCoords --> newCoords
        
        let prevCell = this.mazeObj.board[prevCoords[0]][prevCoords[1]][prevCoords[2]];

        //this stores the floor that is currently being displayed
        let mazeContainer = document.querySelector("#maze-container");
        let kids = mazeContainer.children;

        //we have to get the correct divs # based on the coordinates
        let multiplyBy = this.mazeObj.board[0].length;
        let divNumberPrev = (prevCoords[1] * multiplyBy) + prevCoords[2]
        let divNumberNew = (newCoords[1] * multiplyBy) + newCoords[2];
        
        let divPrev = kids[divNumberPrev];
        let divNew = kids[divNumberNew];

        //put the arrows for div prev
        if(prevCell.moves[4] === false && prevCell.moves[5] === true){
            divPrev.style.backgroundImage = "url('images/down-arrow.svg')";
            divPrev.style.backgroundRepeat = "no-repeat";
            divPrev.style.backgroundPosition = "center";
        }else if(prevCell.moves[4] === true && prevCell.moves[5] === false){
            divPrev.style.backgroundImage = "url('images/up-arrow.svg')";
            divPrev.style.backgroundRepeat = "no-repeat";
            divPrev.style.backgroundPosition = "center";
        }else if(prevCell.moves[4] === true && prevCell.moves[5] === true){
            divPrev.style.backgroundImage = "url('images/up-and-down.svg')";
            divPrev.style.backgroundRepeat = "no-repeat";
            divPrev.style.backgroundPosition = "center";
        }else if(prevCell.moves[4] === false && prevCell.moves[5] === false){
            let divPrevStyle = divPrev.style;
            divPrevStyle.removeProperty("background-image");
            divPrevStyle.removeProperty("background-repeat");
            divPrevStyle.removeProperty("background-position");
        }

        //put the character icon for divNew
        divNew.style.backgroundImage = "url('images/rat.png')";
        divNew.style.backgroundSize = "contain";
        divNew.style.backgroundRepeat = "no-repeat";
    }

}

export default User;