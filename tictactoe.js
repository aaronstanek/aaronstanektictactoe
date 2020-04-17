'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BoardCell = function (_React$Component) {
    _inherits(BoardCell, _React$Component);

    function BoardCell(props) {
        _classCallCheck(this, BoardCell);

        var _this = _possibleConstructorReturn(this, (BoardCell.__proto__ || Object.getPrototypeOf(BoardCell)).call(this, props));

        _this.state = {
            "board": props.board,
            "number": props.number
        };
        return _this;
    }

    _createClass(BoardCell, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var piece = this.state.board.getPeiceAt(this.state.number);
            var f = function f() {
                _this2.clicked();
            };
            return React.createElement(
                "div",
                { className: "boardCell", onClick: f },
                React.createElement(
                    "p",
                    null,
                    piece
                )
            );
        }
    }, {
        key: "clicked",
        value: function clicked() {
            this.state.board.userTurn(this.state.number);
        }
    }]);

    return BoardCell;
}(React.Component);

var BoardRow = function (_React$Component2) {
    _inherits(BoardRow, _React$Component2);

    function BoardRow(props) {
        _classCallCheck(this, BoardRow);

        var _this3 = _possibleConstructorReturn(this, (BoardRow.__proto__ || Object.getPrototypeOf(BoardRow)).call(this, props));

        _this3.state = {
            "board": props.board,
            "number": props.number
        };
        return _this3;
    }

    _createClass(BoardRow, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "boardRow" },
                React.createElement(BoardCell, { board: this.state.board, number: this.state.number }),
                React.createElement(BoardCell, { board: this.state.board, number: this.state.number + 1 }),
                React.createElement(BoardCell, { board: this.state.board, number: this.state.number + 2 })
            );
        }
    }]);

    return BoardRow;
}(React.Component);

var WinnerBanner = function (_React$Component3) {
    _inherits(WinnerBanner, _React$Component3);

    function WinnerBanner(props) {
        _classCallCheck(this, WinnerBanner);

        var _this4 = _possibleConstructorReturn(this, (WinnerBanner.__proto__ || Object.getPrototypeOf(WinnerBanner)).call(this, props));

        _this4.state = {
            "parent": props.parent
        };
        return _this4;
    }

    _createClass(WinnerBanner, [{
        key: "render",
        value: function render() {
            var gameOver = this.state.parent.state.gameOver;
            var winner = this.state.parent.state.winner;
            var text;
            if (!gameOver) {
                text = "Take Your Turn";
            } else if (winner == 0) {
                text = "Draw";
            } else if (winner == 1) {
                text = "Player Wins";
            } else {
                text = "Computer Wins";
            }
            return React.createElement(
                "p",
                { className: "winnerBanner" },
                text
            );
        }
    }]);

    return WinnerBanner;
}(React.Component);

var GameFuncs = function () {
    function GameFuncs() {
        _classCallCheck(this, GameFuncs);
    }

    _createClass(GameFuncs, null, [{
        key: "gameOver",
        value: function gameOver(gameState) {
            for (var i = 0; i < 9; i++) {
                if (gameState[i] == 0) {
                    return false;
                }
            }
            return true;
        }
    }, {
        key: "determineWinner",
        value: function determineWinner(gameState) {
            for (var i = 0; i < 9; i += 3) {
                if (gameState[i] == 0) {
                    continue;
                }
                if (gameState[i + 1] != gameState[i]) {
                    continue;
                }
                if (gameState[i + 2] != gameState[i]) {
                    continue;
                }
                return gameState[i];
            }
            for (var _i = 0; _i < 3; _i++) {
                if (gameState[_i] == 0) {
                    continue;
                }
                if (gameState[_i + 3] != gameState[_i]) {
                    continue;
                }
                if (gameState[_i + 6] != gameState[_i]) {
                    continue;
                }
                return gameState[_i];
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
    }, {
        key: "determineMoveHelper",
        value: function determineMoveHelper(gameState, points, a, b, c) {
            var tally = [0, 0, 0];
            tally[gameState[a]]++;
            tally[gameState[b]]++;
            tally[gameState[c]]++;
            if (tally[0] == 3 || tally[0] == 0) {
                return;
            }
            var increment;
            if (tally[0] == 2) {
                increment = 1;
            } else if (tally[2] % 2 == 0) {
                if (tally[2] == 0) {
                    increment = 10;
                } else {
                    increment = 100;
                }
            } else {
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
    }, {
        key: "determineMove",
        value: function determineMove(gameState) {
            var points = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            GameFuncs.determineMoveHelper(gameState, points, 0, 1, 2);
            GameFuncs.determineMoveHelper(gameState, points, 3, 4, 5);
            GameFuncs.determineMoveHelper(gameState, points, 6, 7, 8);
            GameFuncs.determineMoveHelper(gameState, points, 0, 3, 6);
            GameFuncs.determineMoveHelper(gameState, points, 1, 4, 7);
            GameFuncs.determineMoveHelper(gameState, points, 2, 5, 8);
            GameFuncs.determineMoveHelper(gameState, points, 0, 4, 8);
            GameFuncs.determineMoveHelper(gameState, points, 6, 4, 2);
            var bestScore = points[0];
            var winners = [0];
            for (var i = 1; i < 9; i++) {
                if (points[i] < bestScore) {
                    continue;
                }
                if (points[i] == bestScore) {
                    winners.push(i);
                } else {
                    bestScore = points[i];
                    winners = [i];
                }
            }
            while (true) {
                var pick = Math.floor(Math.random() * winners.length);
                if (gameState[winners[pick]] != 0) {
                    continue;
                }
                return winners[pick];
            }
        }
    }]);

    return GameFuncs;
}();

var Board = function (_React$Component4) {
    _inherits(Board, _React$Component4);

    function Board(props) {
        _classCallCheck(this, Board);

        var _this5 = _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).call(this, props));

        _this5.state = {
            "gameOver": false,
            "winner": 0,
            "arr": [0, 0, 0, 0, 0, 0, 0, 0, 0],
            "parent": props.parent
        };
        _this5.state.parent.rememberBoard(_this5);
        if (!_this5.state.parent.state.userFirst) {
            _this5.computerTurn();
        }
        return _this5;
    }

    _createClass(Board, [{
        key: "reset",
        value: function reset() {
            this.state.gameOver = false;
            this.state.winner = 0;
            this.state.arr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.setState(this.state);
            if (!this.state.parent.state.userFirst) {
                this.computerTurn();
            }
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "boardArea" },
                React.createElement(
                    "div",
                    { className: "board" },
                    React.createElement(BoardRow, { board: this, number: 0 }),
                    React.createElement(BoardRow, { board: this, number: 3 }),
                    React.createElement(BoardRow, { board: this, number: 6 })
                ),
                React.createElement(WinnerBanner, { parent: this })
            );
        }
    }, {
        key: "getPeiceAt",
        value: function getPeiceAt(number) {
            var code = this.state.arr[number];
            return this.state.parent.state.pieces[code];
        }
    }, {
        key: "userTurn",
        value: function userTurn(number) {
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
    }, {
        key: "computerTurn",
        value: function computerTurn() {
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
    }]);

    return Board;
}(React.Component);

var ButtonsArea = function (_React$Component5) {
    _inherits(ButtonsArea, _React$Component5);

    function ButtonsArea(props) {
        _classCallCheck(this, ButtonsArea);

        var _this6 = _possibleConstructorReturn(this, (ButtonsArea.__proto__ || Object.getPrototypeOf(ButtonsArea)).call(this, props));

        _this6.state = {
            "parent": props.parent
        };
        return _this6;
    }

    _createClass(ButtonsArea, [{
        key: "render",
        value: function render() {
            var _this7 = this;

            var piece = this.state.parent.state.pieces[1];
            var order;
            if (this.state.parent.state.userFirst) {
                order = "first";
            } else {
                order = "second";
            }
            var changePiece = function changePiece() {
                _this7.state.parent.changePiece();
            };
            var changeOrder = function changeOrder() {
                _this7.state.parent.changeOrder();
            };
            var newGame = function newGame() {
                _this7.state.parent.newGame();
            };
            return React.createElement(
                "div",
                null,
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement(
                    "p",
                    null,
                    "Player uses ",
                    piece,
                    " ",
                    React.createElement(
                        "button",
                        { onClick: changePiece },
                        "Change"
                    )
                ),
                React.createElement(
                    "p",
                    null,
                    "Player goes ",
                    order,
                    " ",
                    React.createElement(
                        "button",
                        { onClick: changeOrder },
                        "Change"
                    )
                ),
                React.createElement(
                    "button",
                    { onClick: newGame },
                    "New Game"
                )
            );
        }
    }]);

    return ButtonsArea;
}(React.Component);

var TicTacToe = function (_React$Component6) {
    _inherits(TicTacToe, _React$Component6);

    function TicTacToe(props) {
        _classCallCheck(this, TicTacToe);

        var _this8 = _possibleConstructorReturn(this, (TicTacToe.__proto__ || Object.getPrototypeOf(TicTacToe)).call(this, props));

        _this8.state = {
            "pieces": ["", "X", "O"],
            "userFirst": true
        };
        return _this8;
    }

    _createClass(TicTacToe, [{
        key: "changePiece",
        value: function changePiece() {
            var p = this.state.pieces;
            p = [p[0], p[2], p[1]];
            this.state.pieces = p;
            this.setState(this.state);
        }
    }, {
        key: "changeOrder",
        value: function changeOrder() {
            var order = this.state.userFirst;
            if (order) {
                order = false;
            } else {
                order = true;
            }
            this.state.userFirst = order;
            this.setState(this.state);
        }
    }, {
        key: "newGame",
        value: function newGame() {
            this.state.board.reset();
        }
    }, {
        key: "rememberBoard",
        value: function rememberBoard(board) {
            this.state.board = board;
            this.setState(this.state);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(Board, { parent: this }),
                React.createElement(ButtonsArea, { parent: this })
            );
        }
    }]);

    return TicTacToe;
}(React.Component);

ReactDOM.render(React.createElement(TicTacToe, null), document.getElementById('TicTacToe'));