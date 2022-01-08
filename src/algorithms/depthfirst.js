import { Stack } from "./datastructres";
//Todo
//Implement Depth first search
// procedure DFS_iterative(G, v) is
//     let S be a stack
//     S.push(v)
//     while S is not empty do
//         v = S.pop()
//         if v is not labeled as discovered then
//             label v as discovered
//             for all edges from v to w in G.adjacentEdges(v) do 
//                 S.push(w)

export function depthfirst(grid, startNode, finishNode){
    let frontier = new Stack;
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
    if(col > 0) neighbors.push(grid[row][col-1]);
    if(col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if(row > 0) neighbors.push(grid[row-1][col]);
    if(row < grid.length - 1) neighbors.push(grid[row+1][col]);
    return neighbors.filter((neighbors) => !neighbors.isVisited && !neighbors.isWall);
}
