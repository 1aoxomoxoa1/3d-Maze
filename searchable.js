class Searchable{

    //is it abstract?? 
    constructor(initial, goal, board) {
        if (this.constructor === Searchable) {
            throw new Error('Abstract class Searchable cannot be instantiated');
        }
    }

    //should return a set of (action, nextState) pairs
    successor(state){
        throw new Error('Method successor() must be implemented');
    }

    get initial(){
        throw new Error('Method get initial() must be implemented');
    }

    get goal(){
        throw new Error('Method get goal() must be implemented');
    }


}


export default Searchable;