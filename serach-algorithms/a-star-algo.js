import SearchAlgo from "./search-algo-base.js";
import Node from "../node.js";
import MinHeap from "../priority-q-min-heap.js";


class AStar extends SearchAlgo{

    constructor(){
        super();
        this.nodesVisited = undefined;
        this.mazeDomain = undefined;
    }


    // //** THIS FUNCTION IMPLEMENTS A STAR SEARCH FOR MAZEDOMAIN
    //  * 
    //  * @param {*} mazeDomain -- maze search problem that we are searching through
    //  * @returns solution {array} -- list containing indexes on path found by search to goal
    //  */
    search(mazeDomain, currentState = undefined){
        //set the maze domain in the AStar obj instance 
        this.mazeDomain = mazeDomain;

        let frontier = new MinHeap();
        let visited = new Set(); 
        let initialNode; 

        //make initial node and insert into priority queue 
        if(currentState === undefined || currentState.key === mazeDomain.initialState.key){
            initialNode = new Node(undefined, mazeDomain.initialState, "intial", 0 + this.heuristic(mazeDomain.initialState));
        }else{
            initialNode = new Node(undefined, currentState, "intial", 0 + this.heuristic(mazeDomain.initialState));
        }

        frontier.insert(initialNode);

        while(frontier.size !== 0){
            
            //remove the node with the lowest priority (smallest f value) AND add its state to visited
            let currNode = frontier.removeMin();
            visited.add(currNode.state);

            let neighborNodes = [];

            //here we compare the key between current state and goal state
            if(currNode.state.key === mazeDomain.goal.key){
            
                //solution is stored in the path w/in the currNode!
                //store nodesVisited as an attribute of the search algo, this will change each time search() is ran
                let solution = this.getPath(currNode); 
                this.nodesVisited = solution.length - 1;

                return solution;
            }

            //get neighbor directions and states -- [[direction, State], ...] 
            let neighbors = mazeDomain.successor(currNode);

            //turn neighbor states into neighbor nodes
            for(let neighbor of neighbors){
                let nextPathCost = this.distanceFromInitial(currNode) + 1; //each direction we move from parent's pathCost + 1 
                let nextCost = nextPathCost + this.heuristic(neighbor[1]);
                let newNode = new Node(currNode, neighbor[1], neighbor[0], nextCost); 

                //if neighbors state is not visited
                if(this.isStateVisited(neighbor[1], visited) === false){

                    if(this.isNodeInFrontier(newNode, frontier) === false){
                        frontier.insert(newNode);
                    }else{ 
                        //if it is in the frontier, see if its existing path cost is GREATER than what we have in new node
                        let nodeFromFrontier = this.getNodeWithStateFromFrontier(neighbor[1], frontier); 
                        
                        if(nodeFromFrontier.pathCost > newNode.pathCost){
                            frontier.replace(nodeFromFrontier, newNode);
                        }
                    }

                }
            }


        }

        //if frontier is emptied then solution not found -- return false
        return false; 
    }


    //**
    //  * 
    //  * @param {MazeState} currState -- state that we want to match w/in frontier and return its value
    //  * @param {MinHeap} frontier -- collection of nodes we look through
    //  * @returns {Node} -- node that matches w/ key of currState, used in A* 
    //  */
    getNodeWithStateFromFrontier(currState, frontier){
        let currKey = currState.key; 
        let frontierKeys = frontier.storage.map(node => node.state.key); 

        let frontierIdx = frontierKeys.indexOf(currKey); 
        return frontier.storage[frontierIdx]; 

    }


    distanceFromInitial(currNode){
        //CALULATE THiS BY TAKING A NODE --- AND ADDING +1 for each parent --- representing the # of steps 
        let steps = 0; 
        let temp = currNode; 
        while(currNode.parent !== undefined){
            currNode = currNode.parent; 
            steps++; 
        }

        return steps;
    }

    // //**
    //  * 
    //  * @param {Node} currNode -- node obj we are checking key if in frontier
    //  * @param {MinHeap} frontier -- check against storage within the MinHeap
    //  * @returns -- true if frontier contains node, false if not
    //  */
    isNodeInFrontier(currNode, frontier){
        let currKey = currNode.state.key; 
        let frontierKeys = new Set(frontier.storage.map(node => node.state.key));

        if(frontierKeys.has(currKey)){
            return true; 
        }else{
            return false; 
        }


    }

    // //**
    //  * 
    //  * @param {MazeState} currState -- state obj we are checking key if in visited
    //  * @param {Set(MazeState,)} visited -- check against visited
    //  * @returns -- true if visited contins currState ;; false if not
    //  */
    isStateVisited(currState, visited){
        let visitedList = [...visited];
        let visitedKeys = new Set(visitedList.map(element => element.key));

        if(visitedKeys.has(currState.key)){
            return true; 
        }else{
            return false; 
        }
    }


    // //** RETURNS THE VALUE FOR HEURISTIC DISTANCE (h) -- from coords passed in to goal coords
    //  *  
    //  */
    heuristic(state){
        let goalState = this.mazeDomain.goal;
        let goalCoords = goalState.cell.coords; 

        let passedCoords = state.cell.coords; 
    
        //using pythagorean theorem for 3d shapes 
        let distance = Math.sqrt( ((goalCoords[0] - passedCoords[0]) ** 2) + ((goalCoords[1] - passedCoords[1]) ** 2) + ((goalCoords[2] - passedCoords[2]) ** 2))

        return distance;
    }




    // //**
    //  * 
    //  * @param {*} neighbors -- [[direction, MazeState], ...] returned from successor func
    //  * @param {*} visited -- [set of MazeStates] 
    //  * @param {*} frontier -- [MinHeap of Nodes]
    //  * @returns -- [[direction, MazeState], ...] if it is not in visited or frontier
    //  */
    removeVisited(neighbors, visited, frontier){
        //if any of the neighbors are in visited(contains states) , then remove it from the list
        let visitedList = [...visited];
        let visitedKeys = new Set(visitedList.map(element => element.key));

        //get a list of the keys of the frontier (MinHeap ~ priority q)
        let frontierKeys = new Set(frontier.storage.map(node => node.state.key));

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

export default AStar;