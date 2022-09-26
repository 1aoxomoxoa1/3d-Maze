import State from "./state.js";

class MazeState extends State{
    
    //**
    //  * 
    //  * @param {*} key -- JSON string of the cell coords [z, y, x]
    //  */
    constructor(key, cell){
        super(key);
        this.cell = cell; 
    }

}

export default MazeState;