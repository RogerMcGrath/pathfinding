export function astar(grid,startNode,finishNode){
    if(!startNode || !finishNode || startNode === finishNode){
        return false;
    }
    const openo = [];
    const visitedNodesInOrder = [];
    startNode.f = 0
    startNode.g = 0
    openo.push(startNode);
    while(openo.length !== 0){
        sortNodesbyF(openo);
        const q = openo.shift();
        q.isVisited = true;
        visitedNodesInOrder.push(q);
        for(const neighbors of getUnvisitedNeighbors(q,grid)){
            if(neighbors === finishNode){
                neighbors.previousNode = q;
                return visitedNodesInOrder;
            }
            neighbors.g = q.g + 1;
            // if a node with the same position as 
            // successor is in the OPEN list which has a 
            // lower f than successor, skip this successor
            if(neighbors.previousNode!==null)continue;
            else{
            if(!openo.includes(neighbors)){
                openo.unshift(neighbors);
                neighbors.f = neighbors.g + (Math.abs(neighbors.row-finishNode.row) + Math.abs(neighbors.col-finishNode.col));
                neighbors.previousNode = q;
            }else if(q.g<neighbors.g){
                neighbors.g = q.g;
                neighbors.f = neighbors.g + (Math.abs(neighbors.row-finishNode.row) + Math.abs(neighbors.col-finishNode.col));
                neighbors.previousNode = q;
            }
            else if(neighbors.isWall) continue;
        }
            // if a node with the same position as 
            // successor  is in the CLOSED list which has
            // a lower f than successor, skip this successor
            //skip walls
            // else if(neighbors.isVisted){
            //     console.log('hello')
            //     continue
            // }
            // otherwise, add  the node to the open list
        }
    }   
}
function sortNodesbyF(openo){
    return openo.sort((nodeA,nodeB) => nodeA.f - nodeB.f)
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