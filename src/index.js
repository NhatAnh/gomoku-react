import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let classname = "square" + (props.win_row ? ' win': '')
  return (
    <button className={classname} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares, win_condition = 5) {
  const dimension = Math.sqrt(squares.length)
  return ['X', 'O'].map((char) =>{
    for (let i = 0; i < squares.length; i++) {
      if(squares[i] == char){
        let re = [[0,1],[1,1],[1,0],[1,-1]].map((coeff) => {
          let result = true
          let nodes = [char, i]
          for (let j = 1; j < win_condition; j++) {
            nodes.push(i + j*dimension*coeff[0] + j*coeff[1])
            if(squares[i + j*dimension*coeff[0] + j*coeff[1]] !== char)result = false
          }
          return result ? nodes : false
        }).filter((res)=>res)[0]
        if(re)return re
      }
    }
    return false
  }).filter((res)=>res)[0]
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square key={i} win_row={this.props.win_row.indexOf(i) != -1} value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
  }

  render() {
    const board_size = Math.sqrt(this.props.squares.length)
    const size_arr = [...Array(board_size).keys()]
    const board = size_arr.map((row_num) => {
      return (<div className="board-row" key={row_num}>
          {size_arr.map((cell) => this.renderSquare(row_num * board_size + cell))}
        </div>)
    })
    
    return (<div>
      {board}
    </div>);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    const board_size = 30

    this.state = {
      history: [{
        squares: Array(board_size*board_size).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            win_row={winner ? winner.slice(1, winner.length) : []}
            onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

