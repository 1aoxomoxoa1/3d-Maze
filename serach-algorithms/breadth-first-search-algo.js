import Cell from "../cell-class.js";
import SearchAlgo from "./search-algo-base.js";
import Node from "../node.js";


class BreadthFirstSearch extends SearchAlgo{

    constructor(){
        super(); 
        this.nodesVisited = undefined;
    }

    // //** THIS FUNCTION IMPLEMENTS BFS SEARCH FOR MAZEDOMAIN
    //  * 
    //  * @param {*} mazeDomain -- maze search problem that we are searching through
    //  * @returns solution {array} -- list containing indexes on path found by search to goal
    //  */
    search(mazeDomain, currentState = undefined){
        //use the properties of the mazeDomain to call successor and convert moves to tup 
         
        //frontier stores Nodes
        //visited stores states that we have visited (popped and gotten neighbors for)
        let frontier = []; 
        let visited = new Set(); 
        let initialNode;

        //Node(parentState, currState, action to get there, pathCost)
        //make initial node and insert into priority queue 
        if(currentState === undefined || currentState.key === mazeDomain.initialState.key){
            initialNode = new Node(undefined, mazeDomain.initialState, "intial");
        }else{
            initialNode = new Node(undefined, currentState, "intial");
        }

        frontier.push(initialNode);
        
        //while frontier is not empty
        while(frontier.length !== 0){
            
            //take node from the front of the frontier, instead of popping from back
            let currNode = frontier.shift(); 
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

            //add state to visited
            visited.add(currState);

            //get neighbor directions and states -- [[direction, State], ...] 
            let neighbors = mazeDomain.successor(currNode);

            //make sure that none of these are visited or in frontier 
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


    // //**
    //  * 
    //  * @param {*} neighbors -- [[direction, MazeState], ...] returned from successor func
    //  * @param {*} visited -- [set of MazeStates] 
    //  * @param {*} frontier -- [list of Nodes]
    //  * @returns -- [[direction, MazeState], ...] if it is not in visited or frontier
    //  */
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

}

export default BreadthFirstSearch;