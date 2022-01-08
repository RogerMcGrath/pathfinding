import { priorityQueue, Queue } from "./datastructres";

export function greedybestfirst(grid,startNode,finishNode){
    if(!startNode || !finishNode || startNode === finishNode){
        return false;
    }
    const visitedNodesInOrder = [];//closed list
    let frontier = new priorityQueue;
    startNode.f = 0
    frontier.insert(startNode);
    while(frontier.isEmpty){
        const q = frontier.pull();
        q.isVisited = true;
        visitedNodesInOrder.push(q);
        console.log(q);
        for(const neighbor of getUnvisitedNeighbors(q,grid)){
            if(neighbor === finishNode){
                neighbor.previousNode = q;
                return visitedNodesInOrder
            }
            if(!frontier.isHere(neighbor) || !visitedNodesInOrder.includes(neighbor)){
                neighbor.f = (Math.abs(neighbor.row-finishNode.row) + Math.abs(neighbor.col-finishNode.col));
                frontier.insert(neighbor);
                neighbor.previousNode = q;
            }
        }
    }
    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid){
    const neighbors = [];
    const {col,row} = node;
    if(row > 0) neighbors.push(grid[row-1][col]);
    if(row < grid.length - 1) neighbors.push(grid[row+1][col]);
    if(col > 0) neighbors.push(grid[row][col-1]);
    if(col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((neighbors) => !neighbors.isVisited && !neighbors.isWall);
}