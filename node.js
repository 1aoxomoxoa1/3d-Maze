class Node{

    //**
    //  * 
    //  * @param {*} parent -- the node before in the solution path
    //  * @param {*} state -- state objects
    //  * @param {*} action -- "right"
    //  * @param {*} pathCost -- pathCost, defined in A* and informed search algos
    //  */
    constructor(parent, state, action, pathCost=undefined){ 
        this.parent = parent;
        this.state = state; //MazeState obj
        this.action = action; 
        this.pathCost = pathCost;
    }

}

export default Node;