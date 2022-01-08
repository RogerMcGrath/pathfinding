import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render(){
        const {col,isFinish, isStart, isWall, isVisited,onMouseDown,onMouseEnter,onMouseUp,onMouseLeave,row,bomb} = this.props; 
        const extraClassName = isFinish 
          ? 'node-finish' 
          : isStart 
          ? 'node-start' 
          :isWall
          ? 'node-wall'
          :bomb
          ? 'node-bomb'
          :isVisited
          ? 'node-visited'
          : '';
        return (
        <div 
        id={`node-${row}-${col}`}
        className={`node ${extraClassName }`}
        onMouseDown={() => onMouseDown(row,col)}
        onMouseEnter={() => onMouseEnter(row,col)}
        onMouseLeave={() => onMouseLeave(row,col)}
        onMouseUp={() => onMouseUp()}
        >

        </div>);
    }
}

export const DEFAULT_NODE = {
    row:0,
    col:0,
}