import Cell from "../cell-class.js";
import Searchable from "../searchable.js";
import SearchAlgo from "./search-algo-base.js";
import Node from "../node.js";

class DepthFirstSearch extends SearchAlgo{

    constructor(){
        super();
        this.nodesVisited = undefined;
    }   

    search(mazeDomain){
        
        //frontier stores Nodes
        //visited stores states that we have visited (popped and gotten neighbors for)
        let frontier = []; 
        let visited = new Set(); 

        //Node(parentState, currState, action to get there, pathCost)
        let initialNode = new Node(undefined, mazeDomain.initial, "initial");
        frontier.push(initialNode);
        
        //while frontier is not empty
        while(frontier.length !== 0){
            

            //MAKE A STATE HERE TO PUT INTO THE NODE
            // ----HERE WE MAKE THE NODES 

            let currNode = frontier.pop(); 
            let currState = currNode.state;
            let neighborNodes = [];


            //here we compare the key between current state and goal state? 
            if(currState.key === mazeDomain.goal.key){
            
                //solution is stored in the path w/in the currNode!
                //store nodesVisited as an attribute of the search algo, this will change each time search() is ran
                let solution = this.getPath(currNode); 
                this.nodesVisited = solution.length - 1;

                return solution;
            }

            //add state to explored
            visited.add(currState);

            //get neighbor directions and states -- [[direction, State], ...] ---> make these Node Objs 
            let neighbors = mazeDomain.successor(currNode);

            //make sure that none of these are visited or frontier
            let unvisitedNeighbors = this.removeVisited(neighbors, visited, frontier); 

            //turn the neighbors states into node objects
            for(const neighbor of unvisitedNeighbors){
                let neighborNode = new Node(currNode, neighbor[1], neighbor[0]);
                neighborNodes.push(neighborNode);
            }


            frontier.push(...neighborNodes);
        }  

        //if frontier is emptied then return false -- occurs when the goal cell is unreachable (POSSIBLE)
        return false; 
    }


    removeVisited(neighbors, visited, frontier){
        //if any of the neighbors are in visited(contains states) , then remove it from the list
        let visitedList = [...visited];
        let visitedKeys = new Set(visitedList.map(element => element.key));

        //get a list of the keys of the frontier
        let frontierKeys = new Set(frontier.map(node => node.state.key));


        let unvisitedNeighbors = []; 

        for(let i = 0; i < neighbors.length; i++){
            let state = neighbors[i][1]; 
            if(visitedKeys.has(state.key) !== true && frontierKeys.has(state.key) !== true){
                unvisitedNeighbors.push(neighbors[i]);
            }
        }


        return unvisitedNeighbors;
    }


    // //** this function works after the dfs, returning the path from the final node == goalNode back to the initial node
    //  * 
    //  * @param {<Node>} currNode -- node that indicated the goal is reached
    //  * @returns  {array} -- path path from initial to goal showing directions needed to reach goal from initial 
    //  */
    getPath(currNode){
        let path = [];
        
        while(currNode.parent !== undefined){
            path.push(currNode.action);
            currNode = currNode.parent; 
        }

        //path is in reverse, so reverse it
        path.reverse();

        return path;
    }


    // //should return all of the other directions of neighboring nodes that === true (can be moved to )
    // //  **
    // //  * 
    // //  * @param {*} state -- state (MazeState Object) being explored
    // //  * @returns function returning available move directions into a tuple containing (direction [action], coords [nextCoords] )
    // //  */
    // successor(state){
        
    //     //get information from the state
    //     let coords = state.cell.coords;
    //     let myCell = state.cell;

    //     let possibleMoveDirections = [];


    //     //check for moves allowed from the current state
    //     if(myCell.moves[0] === true){
    //         possibleMoveDirections.push("left");
    //     }
    //     if(myCell.moves[1] === true){
    //         possibleMoveDirections.push("right");
    //     }
    //     if(myCell.moves[2] === true){
    //         possibleMoveDirections.push("forward");
    //     }
    //     if(myCell.moves[3] === true){
    //         possibleMoveDirections.push("backward");
    //     }
    //     if(myCell.moves[4] === true){
    //         possibleMoveDirections.push("up");
    //     }
    //     if(myCell.moves[5] === true){
    //         possibleMoveDirections.push("down");
    //     }

    //     //we want to turn the available move directions into a tupple containing (direction [action], coords [nextCoords] )
    //     return this.convertMovesToTup(possibleMoveDirections, coords); 

    // }

    // //**
    // //  * 
    // //  * @param {*} possibleMoveDirections -- a list of all the direction you CAN move from the starting state
    // //  * @param {*} state -- the starting state in coords -- we want the coords of the cells we can
    // //  * @returns 
    // //  */
    // convertMovesToTup(possibleMoveDirections, state){
        
    //     let returnTuples = []; 
    //     let currCoords = state[1]; 

    //     for(let i = 0; i < possibleMoveDirections.length ; i++){

    //         let direction = possibleMoveDirections[i];

    //         if(direction === "left"){
    //             let nextCoords = [...currCoords];
    //             nextCoords[2] -= 1; 
    //             returnTuples[i] = [possibleMoveDirections[i], nextCoords]; 
    //         }else if(direction === "right"){
    //             let nextCoords = [...currCoords];
    //             nextCoords[2] += 1; 
    //             returnTuples[i] = [possibleMoveDirections[i], nextCoords]; 
    //         }else if(direction === "forward"){
    //             let nextCoords = [...currCoords];
    //             nextCoords[1] -= 1; 
    //             returnTuples[i] = [possibleMoveDirections[i], nextCoords]; 
    //         }else if(direction === "backward"){
    //             let nextCoords = [...currCoords];
    //             nextCoords[1] += 1; 
    //             returnTuples[i] = [possibleMoveDirections[i], nextCoords]; 
    //         }else if(direction === "up"){
    //             let nextCoords = [...currCoords];
    //             nextCoords[0] += 1; 
    //             returnTuples[i] = [possibleMoveDirections[i], nextCoords]; 
    //         }else if(direction === "down"){
    //             let nextCoords = [...currCoords];
    //             nextCoords[0] -= 1; 
    //             returnTuples[i] = [possibleMoveDirections[i], nextCoords]; 
    //         }
    //     }

    //     return returnTuples;
    // }
}

export default DepthFirstSearch;
