class SearchAlgo{

    constructor(){
        if (this.constructor === SearchAlgo) {
            throw new Error('Abstract class search Algo cannot be instantiated');
        }
    }
    

    search(){
        throw new Error('Method search() must be implemented');
    }


    getNumNodesEvaluated(){
        throw new Error('Method getNumNodesEvaluated() must be implemented');
    }
}

export default SearchAlgo;