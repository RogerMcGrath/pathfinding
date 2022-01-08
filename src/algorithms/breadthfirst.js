import { Queue } from "./datastructres";

export function breadthfirst(grid, startNode, finishNode){
    let frontier = new Queue;
    frontier.enqueue(startNode);
    const visitedNodesInOrder = []
    while (frontier.isEmpty){
        let node = frontier.dequeue();
        if (node === undefined) return visitedNodesInOrder;
        if(node.isWall) continue;
        if (node === finishNode){
            return visitedNodesInOrder;
        }
        node.isVisited = true;
        visitedNodesInOrder.push(node);
        for (const edges of getUnvisitedNeighbors(node,grid)){
            frontier.enqueue(edges);
            edges.isVisited = true;
            edges.previousNode = node;
        }
    }
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

