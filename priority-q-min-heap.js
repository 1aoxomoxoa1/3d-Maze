
//in this minheap implementation of a priority queue, we will store NODES
//the min Heap is sorted by Node.pathCost --> node with min path cost will be removed w/ removeMin()
class MinHeap{
    
    constructor(){
        this.storage = []; 
        this.size = 0;
    }

    //GETTING INDEXES FOR THE PARENTS AND CHILDREN
    parentIdx(idx){
        return Math.floor((idx - 1) / 2);
    }

    leftChildIdx(idx){
        return (2 * idx) + 1;
    }

    rightChildIdx(idx){
        return (2 * idx) + 2;
    }

    //CHECKING IF IDX HAS PARENT / CHILD
    hasParent(idx){
        return this.parentIdx(idx) >= 0; 
    }

    hasLeftChild(idx){
        return this.leftChildIdx(idx) < this.size; 
    }

    hasRightChild(idx){
        return this.rightChildIdx(idx) < this.size; 
    }

    //GETTING THE INFORMATION OF PARENTS OR CHILDREN --> return Nodes
    parent(idx){
        return this.storage[this.parentIdx(idx)];
    }

    leftChild(idx){
        return this.storage[this.leftChildIdx(idx)];
    }

    rightChild(idx){
        return this.storage[this.rightChildIdx(idx)];
    }

    

    //SWAPPER
    swap(idx1, idx2){
        let temp = this.storage[idx1];
        this.storage[idx1] = this.storage[idx2]; 
        this.storage[idx2] = temp; 
    }


    //INSERTING DATA -- IMPLEMENTED W/ HEAPIFYUP()
    insert(data){
        this.storage[this.size] = data; 
        this.size += 1; 
        this.heapifyUp();
    }

    //called when inserting an element , heapify up from bottom of tree to top , find its place
    heapifyUp(){
        let idx = this.size - 1;
        while(this.hasParent(idx) && 
            this.parent(idx).pathCost > this.storage[idx].pathCost){
                this.swap(this.parentIdx(idx), idx);
                idx = this.parentIdx(idx);
            }
    }

    //called when removing min element (stored at root), 
    heapifyDown(){
        let idx = 0; 

        //you only need to check the left child bc a heap is a complete tree
        while(this.hasLeftChild(idx)){

            //check and see which child is smaller
            let smallerChildIdx = this.leftChildIdx(idx);
            if(this.hasRightChild(idx) && this.rightChild(idx).pathCost < this.leftChild(idx).pathCost){
                smallerChildIdx = this.rightChildIdx(idx);
            }

            //swap if incorrectly positioned
            if(this.storage[smallerChildIdx] < this.storage[idx]){
                break;
            }else{
                this.swap(smallerChildIdx, idx); 
                idx = smallerChildIdx;
            }



        }
    
    }
    
    //returns and removes the minimumn element from the heap
    //minimum is stored at the root
    //replace root with last element and call heapifyDown() to put in correct position
    removeMin(){
        if(this.size === 0){
            throw new Error("SORRY, THE HEAP IS EMPTY, YOU CAN'T REMOVE");
        }

        //we will return this node
        let node = this.storage[0];

        //replace 0 idx with last element && decrement size
        this.storage[0] = this.storage[this.size - 1];
        this.size -= 1; 
        this.heapifyDown();

        return node;
    }

    //helps us in A* search
    replace(nodeInFrontier, replacementNode){

        //get idx of node in frontier
        let frontierKeys = this.storage.map(node => node.state.key);
        let desiredKey = nodeInFrontier.state.key; 
        let idxToReplace = frontierKeys.indexOf(desiredKey); 

        //replace in frontier
        this.storage[idxToReplace] = replacementNode;
    }

}

export default MinHeap; 