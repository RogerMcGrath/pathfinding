export function random(grid,startNode,finishNode,bombNode){
    const newGrid = [];
    for(let row of grid){
        const rows = [];
        for(let node of row){
            if(node!==startNode||node!==finishNode||node!==bombNode) {
                node.isWall = Math.floor(Math.random() * 4) === 0;
                rows.push(node);
            }
        }
        newGrid.push(rows);
    }
    console.log(newGrid);
    return newGrid;
}