// GAMEBOARD IIFE //
const gameboard = (() => {
  let board = ["X", "X", "O", "X", "", "O", "X", "O", "X"];

  const updateBoard = (newBoard) => (board = newBoard);
  const getBoard = () => board;

  return { updateBoard, getBoard };
})();

// PLAYER FACTORY //
const newPlayer = function (name, marker) {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};

const playerOne = newPlayer("Nik", "X");
const playerTwo = newPlayer("Computer", "O");

// GAME CONTROLLER IIFE CONTROLS GAME //
// game controller checks for a win, a tie, restarts the game,
// clears the gameboard on restart, keeps track of how many times each player has won (scoreboard),
// toggles/decides whos turn it is.
// Game controller is essentially the referee

const gameController = (() => {
  const game = {
    playerOneScore: 0,
    playerTwoScore: 0,
    playerOneTurn: "playerOne",
    playerTwoTurn: "playerTwo",
    turn: "",
    winner: "",
    isDraw: false,
  };

  const clearBoard = () =>
    gameboard.updateBoard(gameboard.getBoard().map(() => ""));
  const scanForWin = () => {
    // check for a winner
    for (let i = 0; i < gameboard.getBoard().length; i += 3) {
      const [first, second, third] = gameboard.getBoard().slice(i, i + 3);
      if ([first, second, third].every((cell, i, row) => cell === row[0])) {
        game.winner =
          first === playerOne.getMarker()
            ? playerOne.getName()
            : playerTwo.getName();
        console.log(
          `the winner is ${
            first === playerOne.getMarker()
              ? playerOne.getName()
              : playerTwo.getName()
          }`
        );
        return;
      }
    }

    for (let i = 0; i < 3; i++) {
      const idx_1 = i;
      const idx_2 = idx_1 + 3;
      const idx_3 = idx_2 + 3;
      const first = gameboard.getBoard().slice(idx_1, idx_1 + 1)[0];
      const second = gameboard.getBoard().slice(idx_2, idx_2 + 1)[0];
      const third = gameboard.getBoard().slice(idx_3, idx_3 + 1)[0];

      if ([first, second, third].every((cell, i, col) => cell === col[0])) {
        game.winner =
          first === playerOne.getMarker()
            ? playerOne.getName()
            : playerTwo.getName();
        console.log(
          `the winner is ${
            first === playerOne.getMarker()
              ? playerOne.getName()
              : playerTwo.getName()
          }`
        );
        return;
      }
    }

    game.isDraw = true;

    // if there is a winner (determine who the winner is by the marker)
    // return true
    //assign winner string
    // if there are still cells to fill AND there is no winner, return false;
    // if all cells are filled AND there is no winner, then game is a draw
  };

  const resetGame = () => {
    clearBoard();
    resetScore();
    game.winner = "";
    game.playerOneTurn = "playerOne";
    game.playerTwoTurn = "playerTwo";
  };

  const updateScore = () => {
    game.winner === playerOne.name
      ? game.playerOneScore++
      : game.playerTwoScore++;
  };
  const resetScore = () => {
    game.playerOneScore = 0;
    game.playerTwoScore = 0;
  };
  const updateTurn = () => {
    game.turn = game.playerOneTurn ? game.playerOneTurn : game.playerTwoTurn;
  };
  const getTurn = () => game.turn;
  const getWinner = () => game.winner;

  return {
    clearBoard,
    scanForWin,
    resetGame,
    updateScore,
    updateTurn,
    getTurn,
    getWinner,
  };
})();

console.log(gameboard.getBoard());
gameController.scanForWin();
console.log(gameController.getWinner());
// CHECK WINNER BY COLUMN LOGIC //
// const [first, second, third] = gameboard.getBoard().slice(0, 0 + 3);
// const [fourth, fifth, sixth] = gameboard.getBoard().slice(3, 3 + 3);
// const [seventh, eight, ninth] = gameboard.getBoard().slice(6, 6 + 3);

// loop 3 times
// first iteration: i = 0
// first = i; --0
// second = first + 3; --3
// third = second + 3; --6

// second iteration: i = 1
// first = i; --1`
// second = first + 3; --4
// third = second + 3; --7

// third iteration: i = 2
// first = i; --2
// second = first + 3; --5
// third = second + 3; --8
