//TODO
//Make Stack

export class Queue {
    constructor(){
        this.elements = []
    };

    enqueue(e){
        this.elements.push(e);
    };

    dequeue(){
        return this.elements.shift();
    };

    isEmpty(){
        return this.elements.length === 0;
    }

    peek(){
        return !this.isEmpty() ? this.elements[0] : null;
    }

    length(){
        return this.elements.length;
    }
}
export class priorityQueue{
    constructor(){
        this.elements = []
    };
    insert(e){
        // let highest = this.elements[0];
        this.elements.push(e);
        this.elements.sort((nodeA,nodeB) => nodeA.f - nodeB.f)
    }
    pull(){
        return this.elements.shift();
    };
    isHere(node){
        return this.elements.includes(node);
    };
    isEmpty(){
        return this.elements.length === 0 
    };
}
export class Stack {
    constructor(){
        this.elements = []
    }

    enqueue(e){
        this.elements.push(e);
    }

    dequeue(){
        return this.elements.pop();
    }

    isEmpty(){
        return this.elements.length === 0;
    }

    peek(){
        return !this.isEmpty() ? this.elements[0] : null;
    }

    length(){
        return this.elements.length;
    }
}



