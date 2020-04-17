'use strict';

class BoardCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "board": props.board,
            "number": props.number
        };
    }
    render() {
        var piece = this.state.board.getPeiceAt(this.state.number);
        var f = () => {this.clicked()};
        return (
            <div className="boardCell" onClick={f}>
                <p>{piece}</p>
            </div>
        );
    }
    clicked() {
        this.state.board.userTurn(this.state.number);
    }
}

class BoardRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "board": props.board,
            "number": props.number
        }
    }
    render() {
        return (
            <div className="boardRow">
                <BoardCell board={this.state.board} number={this.state.number} />
                <BoardCell board={this.state.board} number={this.state.number+1} />
                <BoardCell board={this.state.board} number={this.state.number+2} />
            </div>
        );
    }
}

class WinnerBanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "parent": props.parent
        };
    }
    render() {
        var gameOver = this.state.parent.state.gameOver;
        var winner = this.state.parent.state.winner;
        var text;
        if (!gameOver) {
            text = "Take Your Turn";
        }
        else if (winner == 0) {
            text = "Draw";
        }
        else if (winner == 1) {
            text = "Player Wins";
        }
        else {
            text = "Computer Wins";
        }
        return (
            <p className="winnerBanner">{text}</p>
        );
    }
}

class GameFuncs {
    static gameOver(gameState) {
        for (let i = 0; i < 9; i++) {
            if (gameState[i] == 0) {
                return false;
            }
        }
        return true;
    }
    static determineWinner(gameState) {
        for (let i = 0; i < 9; i += 3) {
            if (gameState[i] == 0) {
                continue;
            }
            if (gameState[i+1] != gameState[i]) {
                continue;
            }
            if (gameState[i+2] != gameState[i]) {
                continue;
            }
            return gameState[i];
        }
        for (let i = 0; i < 3; i++) {
            if (gameState[i] == 0) {
                continue;
            }
            if (gameState[i+3] != gameState[i]) {
                continue;
            }
            if (gameState[i+6] != gameState[i]) {
                continue;
            }
            return gameState[i];
        }
        if (gameState[0] != 0) {
            if (gameState[4] == gameState[0]) {
                if (gameState[8] == gameState[0]) {
                    return gameState[0];
                }
            }
        }
        if (gameState[6] != 0) {
            if (gameState[4] == gameState[6]) {
                if (gameState[2] == gameState[6]) {
                    return gameState[6];
                }
            }
        }
        return 0;
    }
    static determineMoveHelper(gameState,points,a,b,c) {
        var tally = [0,0,0];
        tally[gameState[a]]++;
        tally[gameState[b]]++;
        tally[gameState[c]]++;
        if ((tally[0] == 3) || (tally[0] == 0)) {
            return;
        }
        var increment;
        if (tally[0] == 2) {
            increment = 1;
        }
        else if (tally[2] % 2 == 0) {
            if (tally[2] == 0) {
                increment = 10;
            }
            else {
                increment = 100;
            }
        }
        else {
            return;
        }
        if (gameState[a] == 0) {
            points[a] += increment;
        }
        if (gameState[b] == 0) {
            points[b] += increment;
        }
        if (gameState[c] == 0) {
            points[c] += increment;
        }
    }
    static determineMove(gameState) {
        var points = [0,0,0,0,0,0,0,0,0];
        GameFuncs.determineMoveHelper(gameState,points,0,1,2);
        GameFuncs.determineMoveHelper(gameState,points,3,4,5);
        GameFuncs.determineMoveHelper(gameState,points,6,7,8);
        GameFuncs.determineMoveHelper(gameState,points,0,3,6);
        GameFuncs.determineMoveHelper(gameState,points,1,4,7);
        GameFuncs.determineMoveHelper(gameState,points,2,5,8);
        GameFuncs.determineMoveHelper(gameState,points,0,4,8);
        GameFuncs.determineMoveHelper(gameState,points,6,4,2);
        var bestScore = points[0];
        var winners = [0];
        for (let i = 1; i < 9; i++) {
            if (points[i] < bestScore) {
                continue;
            }
            if (points[i] == bestScore) {
                winners.push(i);
            }
            else {
                bestScore = points[i];
                winners = [i];
            }
        }
        while (true) {
            var pick = Math.floor(Math.random()*winners.length);
            if (gameState[winners[pick]] != 0) {
                continue;
            }
            return winners[pick];
        }
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "gameOver": false,
            "winner": 0,
            "arr": [0,0,0,0,0,0,0,0,0],
            "parent": props.parent
        }
        this.state.parent.rememberBoard(this);
        if (!(this.state.parent.state.userFirst)) {
            this.computerTurn();
        }
    }
    reset() {
        this.state.gameOver = false;
        this.state.winner = 0;
        this.state.arr = [0,0,0,0,0,0,0,0,0];
        this.setState(this.state);
        if (!(this.state.parent.state.userFirst)) {
            this.computerTurn();
        }
    }
    render() {
        return (
            <div className="boardArea"><div className="board">
                <BoardRow board={this} number={0} />
                <BoardRow board={this} number={3} />
                <BoardRow board={this} number={6} />
            </div>
                <WinnerBanner parent={this} />
            </div>
        );
    }
    getPeiceAt(number) {
        var code = this.state.arr[number];
        return this.state.parent.state.pieces[code];
    }
    userTurn(number) {
        if (this.state.gameOver) {
            return;
        }
        if (this.state.arr[number] != 0) {
            return;
        }
        this.state.arr[number] = 1;
        if (GameFuncs.determineWinner(this.state.arr) == 1) {
            this.state.gameOver = true;
            this.state.winner = 1;
            this.setState(this.state);
            return;
        }
        if (GameFuncs.gameOver(this.state.arr)) {
            this.state.gameOver = true;
            this.setState(this.state);
            return;
        }
        this.computerTurn();
    }
    computerTurn() {
        var spot = GameFuncs.determineMove(this.state.arr);
        this.state.arr[spot] = 2;
        if (GameFuncs.determineWinner(this.state.arr) == 2) {
            this.state.gameOver = true;
            this.state.winner = 2;
            this.setState(this.state);
            return;
        }
        if (GameFuncs.gameOver(this.state.arr)) {
            this.state.gameOver = true;
            this.setState(this.state);
            return;
        }
        this.setState(this.state);
    }
}

class ButtonsArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "parent": props.parent
        };
    }
    render() {
        var piece = this.state.parent.state.pieces[1];
        var order;
        if (this.state.parent.state.userFirst) {
            order = "first";
        }
        else {
            order = "second";
        }
        var changePiece = () => {this.state.parent.changePiece()};
        var changeOrder = () => {this.state.parent.changeOrder()};
        var newGame = () => {this.state.parent.newGame()};
        return (
            <div>
            <br /><br />
            <p>Player uses {piece} <button onClick={changePiece}>Change</button></p>
            <p>Player goes {order} <button onClick={changeOrder}>Change</button></p>
            <button onClick={newGame}>New Game</button>
            </div>
            );
    }
}

class TicTacToe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "pieces": ["","X","O"],
            "userFirst": true
        };
    }
    changePiece() {
        var p = this.state.pieces;
        p = [p[0],p[2],p[1]];
        this.state.pieces = p;
        this.setState(this.state);
    }
    changeOrder() {
        var order = this.state.userFirst;
        if (order) {
            order = false;
        }
        else {
            order = true;
        }
        this.state.userFirst = order;
        this.setState(this.state);
    }
    newGame() {
        this.state.board.reset();
    }
    rememberBoard(board) {
        this.state.board = board;
        this.setState(this.state);
    }
    render() {
        return (
            <div>
                <Board parent={this} />
                <ButtonsArea parent={this} />
            </div>
        );
    }
}

ReactDOM.render(
    <TicTacToe />,
    document.getElementById('TicTacToe')
  );