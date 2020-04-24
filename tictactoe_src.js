'use strict';

// this is a cell of the board
// it has a letter in it
class BoardCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "board": props.board,
            // the instance of the Board class
            "number": props.number
            // which cell is this?
        };
    }
    render() {
        var piece = this.state.board.getPeiceAt(this.state.number);
        // what is the value in this cell
        var f = () => {this.clicked()};
        return (
            <div className="boardCell" onClick={f}>
                <p>{piece}</p>
            </div>
        );
    }
    clicked() {
        this.state.board.userTurn(this.state.number);
        // indicate to the board that this particular
        // cell was just clicked
    }
}

// it's just a row in the board
// nothing special
class BoardRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "board": props.board,
            "number": props.number
            // what is the number of the leftmost cell
            // in this row?
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

// this displays below the game board
class WinnerBanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "parent": props.parent
        };
    }
    render() {
        var gameOver = this.state.parent.state.gameOver;
        // is the game over
        var winner = this.state.parent.state.winner;
        // if there is a winner, who is it?
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

// just a class containing the game logic
class GameFuncs {
    static gameOver(gameState) {
        // returns true iff all of the
        // cells have been filled
        for (let i = 0; i < 9; i++) {
            if (gameState[i] == 0) {
                return false;
            }
        }
        return true;
    }
    static determineWinner(gameState) {
        // determines the winner if any
        // 0 for no winner
        // 1 for user is winner
        // 2 for computer is winner
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
        // increments the points counter if points need
        // to be awards based on this potential winning configuration
        // gives 1 point to empty cells with one other cell filled
        // in this winning configuration
        // (this will either block the player, or give the computer 2 in a row)
        // gives 10 points to empty cells with two player cells
        // in this winning configuration (stop the player winning if you can)
        // gives 100 points to empty cells with two computer cells
        // in this winning configuration (place the winning move if you can)
        var tally = [0,0,0];
        // how many of each cell are in this winning configuration?
        tally[gameState[a]]++;
        tally[gameState[b]]++;
        tally[gameState[c]]++;
        if ((tally[0] == 3) || (tally[0] == 0)) {
            // the winning configuration is either empty or full
            // zero points either way
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
            // the one empty spot has one player piece
            // and one computer piece
            // useless to play here
            // zero points
            return;
        }
        // increment is how many points to give to each empty
        // cell in this winning configuration
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
        // determines which move the computer should make
        // first it gives points to the different cells based
        // on the other pieces
        var points = [0,0,0,0,0,0,0,0,0];
        // how many points are assigned to each cell
        // the function calls below increment the point counters
        // each call represents one of the possible ways to win
        GameFuncs.determineMoveHelper(gameState,points,0,1,2);
        GameFuncs.determineMoveHelper(gameState,points,3,4,5);
        GameFuncs.determineMoveHelper(gameState,points,6,7,8);
        GameFuncs.determineMoveHelper(gameState,points,0,3,6);
        GameFuncs.determineMoveHelper(gameState,points,1,4,7);
        GameFuncs.determineMoveHelper(gameState,points,2,5,8);
        GameFuncs.determineMoveHelper(gameState,points,0,4,8);
        GameFuncs.determineMoveHelper(gameState,points,6,4,2);
        // determine which cells have the maximal number
        // of points
        // then pick randomly among them
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

// Board is the 3 by 3 grid
// and the banner under it
class Board extends React.Component {
    constructor(props) {
        super(props);
        // set all the variables to their
        // initial values
        this.state = {
            "gameOver": false, // the game is not over
            "winner": 0, // there is no winner yet
            "arr": [0,0,0,0,0,0,0,0,0], // there are no pieces yet
            "parent": props.parent
        }
        this.state.parent.rememberBoard(this);
        if (!(this.state.parent.state.userFirst)) {
            this.computerTurn();
            // if the setting userFirst is false
            // then the computer makes the first move
        }
    }
    reset() {
        // reset the game
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
        // returns the piece at a particular location
        var code = this.state.arr[number];
        return this.state.parent.state.pieces[code];
    }
    userTurn(number) {
        // inplements the user's turn
        if (this.state.gameOver) {
            return;
            // if the game is over
            // ignore user input
        }
        if (this.state.arr[number] != 0) {
            return;
            // if this cell is taken,
            // ignore user input
        }
        this.state.arr[number] = 1;
        // place a user piece in the request spot
        if (GameFuncs.determineWinner(this.state.arr) == 1) {
            // if the user just won
            this.state.gameOver = true;
            this.state.winner = 1;
            this.setState(this.state);
            return;
        }
        if (GameFuncs.gameOver(this.state.arr)) {
            // if all the spots are taken
            this.state.gameOver = true;
            this.setState(this.state);
            return;
        }
        this.computerTurn();
    }
    computerTurn() {
        var spot = GameFuncs.determineMove(this.state.arr);
        // spot is where the computer should place its piece
        this.state.arr[spot] = 2;
        // place a computer piece in the request spot
        if (GameFuncs.determineWinner(this.state.arr) == 2) {
            // if the computer just won
            this.state.gameOver = true;
            this.state.winner = 2;
            this.setState(this.state);
            return;
        }
        if (GameFuncs.gameOver(this.state.arr)) {
            // if all the spots are taken
            this.state.gameOver = true;
            this.setState(this.state);
            return;
        }
        this.setState(this.state);
    }
}

// ButtonsArea holds the buttons that can change the settings
class ButtonsArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "parent": props.parent
        };
    }
    render() {
        var piece = this.state.parent.state.pieces[1];
        // which piece is the user using?
        var order; // is the player going first or second?
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

// TicTacToe encapsulates everything
class TicTacToe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "pieces": ["","X","O"],
            // which players use which pieces?
            "userFirst": true
            // who goes first?
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