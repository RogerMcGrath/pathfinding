import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra'
import { breadthfirst } from '../algorithms/breadthfirst';
import { depthfirst } from '../algorithms/depthfirst';
import { astar } from '../algorithms/astar';
import { greedybestfirst } from '../algorithms/Greedy';
import { random } from '../maze/random';
import { recdiv } from '../maze/Recursive_div';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import './PathfindingVisualizer.css';

const INIT_START_NODE_ROW = 10;
const INIT_START_NODE_COL = 14;
const INIT_FINISH_NODE_ROW = 10;
const INIT_FINISH_NODE_COL = 35;
const BOMB_START_ROW = 10;
const BOMB_START_COL = 25;

let START_BOMB_ROW = BOMB_START_ROW;
let START_BOMB_COL = BOMB_START_COL;
let START_NODE_ROW = INIT_START_NODE_ROW;
let START_NODE_COL = INIT_START_NODE_COL;
let FINISH_NODE_ROW = INIT_FINISH_NODE_ROW;
let FINISH_NODE_COL = INIT_FINISH_NODE_COL;

var PathFind = undefined;
export default class PathfindingVisualizer extends Component{
    constructor(){
        super();
        this.state = {
            grid: [], 
            mouseIsPressed: false,
            startIsPressed: false,
            endIsPressed: false,
            bombIsPressed: false,
            algoIsOpen:false,
            mazeIsOpen:false,
            Visualize:'Visualize',
            bombIsPresent:false,
            bombText:'Add',
            solvedState:false,
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    handleMouseDown(row,col){
        if(row === START_NODE_ROW && col === START_NODE_COL){
            const newGrid = this.state.grid;
            const node = newGrid[row][col];
            const newNode ={
                ...node,
                isStart: false,
            }
            newGrid[row][col] = newNode;
            this.setState({grid:newGrid,mouseIsPressed: true, startIsPressed: true});
        }
        else if(row === FINISH_NODE_ROW && col === FINISH_NODE_COL){
            const newGrid = this.state.grid;
            const node = newGrid[row][col];
            const newNode ={
                ...node,
                isFinish: false,
            }
            newGrid[row][col] = newNode;
            this.setState({grid:newGrid,mouseIsPressed: true, endIsPressed: true});
        }
        else if(row === START_BOMB_ROW && col === START_BOMB_COL && this.state.bombIsPresent){
            const newGrid = this.state.grid;
            const node = newGrid[row][col];
            const newNode ={
                ...node,
                bomb: false,
            }
            newGrid[row][col] = newNode;
            this.setState({grid:newGrid,mouseIsPressed:true,bombIsPressed:true});
        }
        else if (this.state.startIsPressed){
            const newGrid = getNewStartingNode(this.state.grid,row,col);
            START_NODE_ROW = row;
            START_NODE_COL = col;
            this.setState({grid:newGrid,mouseIsPressed:false,startIsPressed:false})
        }
        else if (this.state.endIsPressed){
            const newGrid = getNewEndingingNode(this.state.grid,row,col);
            FINISH_NODE_ROW = row;
            FINISH_NODE_COL = col;
            this.setState({grid:newGrid,mouseIsPressed:false,endIsPressed:false})
        }
        else if (this.state.bombIsPressed){
            const newGrid = getNewBombNode(this.state.grid,row,col);
            START_BOMB_ROW = row;
            START_BOMB_COL = col;
            this.setState({grid:newGrid,mouseIsPressed:false,bombIsPressed:false})
        }
        else{
            const newGrid = getNewGridWithWallToggled(this.state.grid, row,col);
            this.setState({grid:newGrid,mouseIsPressed: true});
        }
    }

    handleMouseEnter(row,col){
        if (!this.state.mouseIsPressed) return;
        else if(!this.state.startIsPressed && !this.state.endIsPressed && !this.state.bombIsPressed){
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({grid: newGrid});
        }
        if(!this.state.solvedState){
        if(this.state.startIsPressed){
            document.getElementById(`node-${row}-${col}`).className = 'node node-part-start'
        }
        else if(this.state.endIsPressed){
            document.getElementById(`node-${row}-${col}`).className = 'node node-part-start'
        }
        else if(this.state.bombIsPressed){
            document.getElementById(`node-${row}-${col}`).className = 'node node-part-start'
        }
    }
        else if(this.state.solvedState){
            if(this.state.startIsPressed){
                document.getElementById(`node-${row}-${col}`).className = 'node node-start'
                const newGrid = getNewStartingNode(this.state.grid,row,col);
                newGrid[START_NODE_ROW][START_NODE_COL].isStart = false;
                START_NODE_ROW = row;
                START_NODE_COL = col;
                this.setState({grid:newGrid,mouseIsPressed:true,startIsPressed:true});
            }
            else if(this.state.endIsPressed){
                document.getElementById(`node-${row}-${col}`).className = 'node node-finish'
                const newGrid = getNewEndingingNode(this.state.grid,row,col);
                newGrid[FINISH_NODE_ROW][FINISH_NODE_COL].isFinish = false;
                FINISH_NODE_ROW = row;
                FINISH_NODE_COL = col;
                this.setState({grid:newGrid,mouseIsPressed:true,endIsPressed:true});
            }
            else if(this.state.bombIsPressed){
                document.getElementById(`node-${row}-${col}`).className = 'node node-bomb'
                const newGrid = getNewBombNode(this.state.grid,row,col);
                newGrid[START_BOMB_ROW][START_BOMB_COL].bomb = false;
                START_BOMB_ROW = row;
                START_BOMB_COL = col;
                this.setState({grid:newGrid,mouseIsPressed:true,bombIsPressed:true})
            }
            this.visualizeAlgo()
        }
    }

    handleMouseLeave(row,col){
        if(this.state.startIsPressed){
            document.getElementById(`node-${row}-${col}`).className = 'node'
        }
        else if(this.state.endIsPressed){
            document.getElementById(`node-${row}-${col}`).className = 'node'
        }
        else if(this.state.bombIsPressed){
            document.getElementById(`node-${row}-${col}`).className = 'node'
        }
    }
    handleMouseup(row,col){
        if (this.state.startIsPressed){
            const newGrid = getNewStartingNode(this.state.grid,row,col);
            this.setState({grid:newGrid,mouseIsPressed:false,startIsPressed:false})
            START_NODE_ROW = row;
            START_NODE_COL = col;
        }
        if (this.state.endIsPressed){
            const newGrid = getNewEndingingNode(this.state.grid,row,col);
            this.setState({grid:newGrid,mouseIsPressed:false,endIsPressed:false})
            FINISH_NODE_ROW = row;
            FINISH_NODE_COL = col;
        }
        if (this.state.bombIsPressed){
            const newGrid = getNewBombNode(this.state.grid,row,col);
            this.setState({grid:newGrid,mouseIsPressed:false,bombIsPressed:false})
            START_BOMB_ROW = row;
            START_BOMB_COL = col;
        }
        else{
        this.setState({mouseIsPressed: false});
        }
    }

     animateAlgo(visitedNodesInOrder,nodesInShortestPathOrder){
        this.state.solvedState = true;
        if(nodesInShortestPathOrder === undefined) this.state.solvedState = false;
        for (let i = 0; i <= visitedNodesInOrder.length; i++){
            if (i === visitedNodesInOrder.length && nodesInShortestPathOrder != undefined){
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder)
                },10 * i);
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if(!node.bomb&&!node.isStart&&!node.isFinish){
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                }
            }, 10 * i); 
            
        }
    }
    recalc(visitedNodesInOrder,nodesInShortestPathOrder){
        for(let i=0;i<=visitedNodesInOrder.length-1;i++){
            const node = visitedNodesInOrder[i];
            node.isVisited = false;
            if(i===visitedNodesInOrder.length-1 && nodesInShortestPathOrder != undefined){
                this.ShortestPath(nodesInShortestPathOrder);
            }
            if(!node.bomb&&!node.isStart&&!node.isFinish){
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-calc';
            }
        }
    }
    ShortestPath(nodesInShortestPathOrder){
        for(let i=0;i<nodesInShortestPathOrder.length; i++){
            setTimeout(() =>{
                const node = nodesInShortestPathOrder[i];
                if(!node.bomb&&!node.isStart&&!node.isFinish){
                document.getElementById(`node-${node.row}-${node.col}`).className =
                  'node node-new-short'
                }
            },10);
    }
}
    animateShortestPath(nodesInShortestPathOrder){
        for(let i = 0; i<nodesInShortestPathOrder.length; i++){
            setTimeout(() =>{
                const node = nodesInShortestPathOrder[i];
                if(!node.bomb&&!node.isStart&&!node.isFinish){
                document.getElementById(`node-${node.row}-${node.col}`).className =
                  'node node-shortest-path'
                }
            }, 15 * i);
        }
    }
    Bomb(){
        this.clearpath(START_NODE_ROW,START_NODE_COL,FINISH_NODE_ROW,FINISH_NODE_COL,false);
        if(this.state.bombText==='Add'){
            const Newgrid = this.state.grid;
            const node = Newgrid[START_BOMB_ROW][START_BOMB_COL];
            const BombNode = {
                ...node,
                bomb:true,
                isWall:false
            };
            Newgrid[START_BOMB_ROW][START_BOMB_COL] = BombNode;
            this.setState({grid:Newgrid,bombText:'Remove',bombIsPresent:true})
        }
        else{
            const {grid} = this.state;
            const node = grid[START_BOMB_ROW][START_BOMB_COL];
            const BombNode = {
                ...node,
                bomb:false,
            };
            grid[START_BOMB_ROW][START_BOMB_COL] = BombNode;
            this.setState({grid:grid,bombText:'Add',bombIsPresent:false})
            START_BOMB_ROW=BOMB_START_ROW;
            START_BOMB_COL=BOMB_START_COL;
            return grid; 
        }
    }
    clearpath(SNR,SNC,FNR,FNC,state){
        this.state.solvedState = state;
        const {grid} = this.state;
        for(let row=0;row<22;row++){
            for(let col=0;col<52;col++){
                if (row === SNR && col === SNC){
                    document.getElementById(`node-${row}-${col}`).className = 'node node-start'
                }
                else if (row === FNR && col === FNC){
                    document.getElementById(`node-${row}-${col}`).className = 'node node-finish'
                }
                else if(grid[row][col].bomb === true){
                    document.getElementById(`node-${row}-${col}`).className = 'node node-bomb'
                }
                else if (grid[row][col].isWall === true){
                    continue;
                }
                else if (document.getElementById(`node-${row}-${col}`).className === 'node-visited'){
                    document.getElementById(`node-${row}-${col}`).className = 'node'
                }
                else{
                    document.getElementById(`node-${row}-${col}`).className = 'node'
                }
                grid[row][col].isVisited=false
                grid[row][col].distance=Infinity
                grid[row][col].previousNode=null
            }
        } 
    }
    clearwalls(SNR,SNC,FNR,FNC){
        const {grid} = this.state;
        let node = undefined;
        let newNode = undefined;
        for(let row=0;row<22;row++){
            for(let col=0;col<52;col++){
                node = grid[row][col];
                if(!node.isWall) continue;
                document.getElementById(`node-${row}-${col}`).className = 'node';
                node = grid[row][col];
                newNode = {
                    ...node,
                    isVisited:false,
                    distance:Infinity,
                    isWall:false,
                }
                    grid[row][col] = newNode;
                
            }
        }
        this.setState({grid:grid}); 
    }
    clearboard(){
        for(let i=0; i<2;i++){
            this.clearpath(INIT_START_NODE_ROW,INIT_START_NODE_COL,INIT_FINISH_NODE_ROW,INIT_FINISH_NODE_COL,false);
            this.clearwalls(INIT_START_NODE_ROW,INIT_START_NODE_COL,INIT_FINISH_NODE_ROW,INIT_FINISH_NODE_COL);
            // const newGrid = getInitialGrid();
            // this.setState({grid: newGrid});
            START_NODE_ROW = INIT_START_NODE_ROW;
            START_NODE_COL = INIT_START_NODE_COL;
            FINISH_NODE_ROW = INIT_FINISH_NODE_ROW;
            FINISH_NODE_COL = INIT_FINISH_NODE_COL;
        }
    }
    Reveal(Menu){
        if(Menu === 'Maze'){
            if(!this.mazeIsOpen){
                document.getElementById(`${Menu}`).className='dropdown-menu maze';
            }
            else if(this.mazeIsOpen){
                document.getElementById(`${Menu}`).className='dropdown-menu-close';
            }
            this.mazeIsOpen = !this.mazeIsOpen;
            return;
        }
        if(!this.algoIsOpen){
            document.getElementById(`${Menu}`).className='dropdown-menu';
        }
        else if(this.algoIsOpen){
            document.getElementById(`${Menu}`).className='dropdown-menu-close';
        }
        this.algoIsOpen = !this.algoIsOpen;
    }
    Switch(Switching,Menu){
        this.clearpath(START_NODE_ROW,START_NODE_COL,FINISH_NODE_ROW,FINISH_NODE_COL,false);
        this.setState({Visualize:`Visualize ${Switching}`});
        this.Reveal(Menu);
    }
    visualizeAlgo(){
        if(!this.state.solvedState){
            this.clearpath(START_NODE_ROW,START_NODE_COL,FINISH_NODE_ROW,FINISH_NODE_COL,false);
        }else if(this.state.solvedState){
            this.clearpath(START_NODE_ROW,START_NODE_COL,FINISH_NODE_ROW,FINISH_NODE_COL,true);
        }
        const grid = this.state.grid;
        const hrid = this.state.grid;
        let startNode = grid[START_NODE_ROW][START_NODE_COL];
        let finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        if(this.state.bombIsPresent){
            startNode = grid[START_NODE_ROW][START_NODE_COL];
            finishNode = grid[START_BOMB_ROW][START_BOMB_COL];
            let visitedNodesOrder = PathFind(grid,startNode,finishNode);
            let nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
            let place = nodesInShortestPathOrder
            if(!this.state.solvedState){
                this.clearpath(START_NODE_ROW,START_NODE_COL,FINISH_NODE_ROW,FINISH_NODE_COL,false)
                this.animateAlgo(visitedNodesOrder,undefined);
            }else{
                this.clearpath(START_NODE_ROW,START_NODE_COL,FINISH_NODE_ROW,FINISH_NODE_COL,true);
                this.recalc(visitedNodesOrder,undefined)
            }
            finishNode.previousNode = null;
            startNode = finishNode;
            finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            let visitedNodesInOrder = PathFind(hrid,startNode,finishNode);
            nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
            let visitedNodes = visitedNodesInOrder.length + visitedNodesOrder.length;
            nodesInShortestPathOrder = place.concat(nodesInShortestPathOrder);
            nodesInShortestPathOrder.pop();
            if(!this.state.solvedState){
                setTimeout(() => {this.animateAlgo(visitedNodesInOrder,nodesInShortestPathOrder)},visitedNodes*6);
            }else{
                this.recalc(visitedNodesInOrder,nodesInShortestPathOrder);   
            }
            return;
        }
        const visitedNodesInOrder = PathFind(grid,startNode,finishNode);
        console.log(visitedNodesInOrder);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        nodesInShortestPathOrder.shift();
        visitedNodesInOrder.shift();
        if(!this.state.solvedState){
            this.animateAlgo(visitedNodesInOrder,nodesInShortestPathOrder)
        }else{
            this.recalc(visitedNodesInOrder,nodesInShortestPathOrder);   
        }
    }
    Start(){
        switch(this.state.Visualize){
            case 'Visualize Dijkstra':
                PathFind = dijkstra;
                this.visualizeAlgo(this.animateAlgo);
                break;
            case 'Visualize BFS':
                PathFind = breadthfirst;
                this.visualizeAlgo(this.animateAlgo);
                break;
            case 'Visualize DFS':
                PathFind = depthfirst;
                this.visualizeAlgo(this.animateAlgo);
                break;
            case 'Visualize A*':
                PathFind = astar;
                this.visualizeAlgo(this.animateAlgo);
                break;
            case 'Visualize Greedy':
                PathFind = greedybestfirst;
                this.visualizeAlgo();
            
        }
    }
    Maze(Mazed,Menu){
        const {grid} = this.state;
        let walls = [];
        let startNode = grid[START_NODE_ROW][START_NODE_COL];
        let finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        let bombNode = grid[START_BOMB_ROW][START_BOMB_COL];
        let newGrid = []
        switch(Mazed){
            case 'Recursive':
                newGrid = recdiv(grid,startNode,finishNode,bombNode);
                this.Reveal(Menu);
                for(let node of newGrid){
                    grid[node[0]][node[1]].isWall = true;
                }
                this.setState({grid:grid});
                break;
            case 'Random':
                // this.clearpath(START_NODE_ROW,START_NODE_COL,FINISH_NODE_ROW,FINISH_NODE_COL);
                // this.clearwalls(START_NODE_ROW,START_NODE_COL,FINISH_NODE_ROW,FINISH_NODE_COL);
                newGrid = random(grid,startNode,finishNode,bombNode);
                this.Reveal(Menu);
                this.setState({grid:newGrid});
                break;
        }
    }
    render() {
        const {grid, mouseIsPressed} = this.state;

        return(
        <div className='container'>
            <div className='navbarDiv'>
                <nav className='navbar navbar-inverse'>
                    <div className='container-fluid'>
                        <div className='navbar-header'>
                        <a id="refreshButton" className="navbar-brand" href="index.html">Pathfinding.io</a>
                        </div>
                    <div className='nava'>
                    <ul className='nav navbar-nav'>
                        <li className='dropdown'>
                            <a className='dropdown-toggle' onClick={() => this.Reveal('Algorithms')}>Algorithms <FontAwesomeIcon icon={faChevronDown}/></a>
                            <ul className='dropdown-menu-close menu-items' id='Algorithms'>
                                <li id='DijkstraStart' className='navbar-inverse menu-items'>
                                    <a className='menu-items'onClick={() => this.Switch('Dijkstra','Algorithms')}>Dijkstra's Algorithm</a>
                                </li>
                                <li id='BreadthFirstStart' className='navbar-inverse menu-items'>
                                    <a className='menu-items'onClick={() => this.Switch('BFS','Algorithms')}>Breadth First Search</a>
                                </li>
                                <li id='DepthFirstStart' className='navbar-inverse menu-items'>
                                    <a className='menu-items'onClick={() => this.Switch('DFS','Algorithms')}>Depth First Search</a>
                                </li>
                                <li id='A*Start' className='navbar-inverse menu-items'>
                                    <a className='menu-items'onClick={() => this.Switch('A*','Algorithms')}>A* Search</a>
                                </li>
                                <li id='GreedyBestFirst' className='navbar-inverse menu-items'>
                                    <a className='menu-items'onClick={() => this.Switch('Greedy','Algorithms')}>Greedy Best First Search</a>
                                </li>
                            </ul>
                        </li>
                        <li className='dropdown'>
                            <a className='dropdown-toggle' onClick={() => this.Reveal('Maze')}>Mazes and Patterns <FontAwesomeIcon icon={faChevronDown}/></a>
                            <ul className='dropdown-menu-close menu-items' id='Maze'>
                                <li id='RecursiveDivison' className='navbar-inverse menu-items'>
                                    <a className='menu-items'onClick={() => this.Maze('Recursive','Maze')}>Recursive Division</a>
                                </li>
                                <li id='Random' className='navbar-inverse menu-items'>
                                    <a className='menu-items'onClick={() => this.Maze('Random','Maze')}>Random Maze</a>
                                </li>
                            </ul>
                        </li>
                        <li className='dropdown'>
                            <a id="bomb"className='dropdown-toggle' onClick={() => this.Bomb()}>{this.state.bombText} Bomb</a>
                        </li>
                        <li className='dropdown-toggle'>
                            <button className='ActualStartButton' onClick={() => this.Start()}>{this.state.Visualize}</button>
                        </li>
                        <li className='dropdown'>
                            <a id="bomb"className='dropdown-toggle' onClick={() => this.clearboard()}>Clear Board</a>
                        </li>
                        <li className='dropdown'>
                            <a id="bomb"className='dropdown-toggle'  onClick={() => this.clearwalls(START_NODE_ROW,START_NODE_COL,FINISH_NODE_ROW,FINISH_NODE_COL)}>Clear Walls</a>
                        </li>
                        <li className='dropdown'>
                            <a id="bomb"className='dropdown-toggle' onClick={() => this.clearpath(START_NODE_ROW,START_NODE_COL,FINISH_NODE_ROW,FINISH_NODE_COL,false)}>Clear Path</a>
                        </li>
                    </ul>
                    </div>
                    </div>
                </nav>
            </div>
            <div className='grid'>
                {grid.map((row,rowIdx) => {
                    return(
                        <div key={rowIdx} className='row'>
                            {row.map((node, NodeIdx) => {
                                const {row, col, isStart, isFinish, isVisited,isWall,bomb} = node;
                                return(
                                    <Node
                                    key={NodeIdx}
                                    isStart={isStart}
                                    isFinish={isFinish}
                                    isVisited={isVisited}
                                    col={col}
                                    isWall={isWall}
                                    bomb={bomb}
                                    mouseIsPressed={mouseIsPressed}
                                    onMouseDown={(row,col) => this.handleMouseDown(row,col)}
                                    onMouseEnter={(row,col) => this.handleMouseEnter(row,col)}
                                    onMouseLeave={() => this.handleMouseLeave(row,col)}
                                    onMouseUp = {() => this.handleMouseup(row,col)}
                                    row={row}
                                    ></Node>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
        );
    }
}

const getInitialGrid = () =>{
    const grid =[]
    for (let row = 0; row<22;row++){
        const currentRow = []; 
        for (let col = 0; col <52; col++){
            currentRow.push(createNode(col,row));
        }
        grid.push(currentRow);
    }
    return grid;
}

const createNode = (col,row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL, 
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        weight: undefined,
        isVisited: false,
        isWall: false,
        previousNode: null,
        f:undefined,
        g:undefined,
        h:undefined,
        bomb: false,
    };
};

const getNewStartingNode = (grid,row,col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isStart: true,
        isWall: false,
    };
    newGrid[row][col] = newNode;
    return newGrid
}
const getNewEndingingNode = (grid,row,col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isFinish: true,
        isWall: false,
    };
    newGrid[row][col] = newNode;
    return newGrid
}
const getNewBombNode = (grid,row,col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        bomb: true,
        isWall: false,
    };
    newGrid[row][col] = newNode;
    return newGrid
}


const getNewGridWithWallToggled = (grid,row,col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid
}