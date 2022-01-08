let walls;
export function recdiv(grid,startNode,finishNode,bombNode){
    getCleanGrid(grid);
    // grid = initMaze(grid);
    let vertical = range(grid[0].length);
    let horizontal = range(grid.length);
    walls = [];
    console.log(vertical,horizontal);
    initMaze(grid);
    getRecursiveWalls(vertical,horizontal,grid);
    console.log(walls)
    return walls;
}

function range(len) {
    let result = [];
    for (let i = 1; i < len-1; i++) {
      result.push(i);
    }
    return result;
  }
function getRecursiveWalls(vertical,horizontal,grid){
    if(vertical.length < 2 || horizontal.length < 2){
        return;
    }
    let dir;
    let num;
    if (vertical.length > horizontal.length) {
        dir = 0;
        num = generateOddRandomNumber(vertical);
    }
    if (vertical.length <= horizontal.length) {
        dir = 1;
        num = generateOddRandomNumber(horizontal);
    }

    if(dir===0){
        addWall(dir,num,vertical,horizontal,grid);
        getRecursiveWalls(
            vertical.slice(0, vertical.indexOf(num)),
            horizontal,
            grid,
          );
        getRecursiveWalls(
            vertical.slice(vertical.indexOf(num) + 1),
            horizontal,
            grid,
          );
    }else{
        addWall(dir, num, vertical, horizontal,grid);
        getRecursiveWalls(
        vertical,
        horizontal.slice(0, horizontal.indexOf(num)),
        grid,
        );
        getRecursiveWalls(
        vertical,
        horizontal.slice(horizontal.indexOf(num) + 1),
        grid,
        );
    }

}

function addWall(dir,num,vertical,horizontal,grid){
    let isStartFinish = false;
    let tempwalls = [];
    if(dir===0){
        if (horizontal.length === 2) return;
        for(let temp of horizontal){
            if(grid[temp][num].isStart===true||grid[temp][num].isFinish===true||grid[temp][num].bomb===true){
            isStartFinish = true;
            continue;
            }
            tempwalls.push([temp,num]);
        }
    }else{
        if (vertical.length === 2) return;
        for(let temp of vertical){
            if(grid[num][temp].isStart===true||grid[num][temp].isFinish===true||grid[num][temp].bomb===true){
                isStartFinish = true;
                continue;
            }
            tempwalls.push([num,temp]);
        }
    }
    if (!isStartFinish) {
        tempwalls.splice(generateRandomNumber(tempwalls.length), 1);
    }
    for(let wall of tempwalls){
        walls.push(wall)
    }
}

function generateOddRandomNumber(array) {
    let max = array.length-1;
    let randomNum =
      Math.floor(Math.random() * (max / 2)) +
      Math.floor(Math.random() * (max / 2));
    if (randomNum % 2 === 0) {
      if (randomNum === max) {
        randomNum -= 1;
      } else {
        randomNum += 1;
      }
    }
    return array[randomNum];
  }
function getCleanGrid(grid){
    for(let row of grid){
        for(let col of row){
            col.isWall = false;
        }
    }
}

function initMaze(grid){
    for(let i=0;i<52;i++){
        let node = grid[0][i];
        if(!node.isStart || !node.isFinish || !node.bomb){
            walls.push([0,i])
        }
        node = grid[21][i];
        if(!node.isStart || !node.isFinish|| !node.bomb){
            walls.push([21,i])
        }
    
    }
    for(let i=0;i<22;i++){
        let node = grid[i][0];
        if(!node.isStart || !node.isFinish || !node.bomb){
            walls.push([i,0])
        }
        node = grid[i][51];
        if(!node.isStart || !node.isFinish || !node.bomb){
            walls.push([i,51])
        }
    }
}
function generateRandomNumber(max) {
    let randomNum =
      Math.floor(Math.random() * (max / 2)) +
      Math.floor(Math.random() * (max / 2));
    if (randomNum % 2 !== 0) {
      if (randomNum === max) {
        randomNum -= 1;
      } else {
        randomNum += 1;
      }
    }
    return randomNum;
  }