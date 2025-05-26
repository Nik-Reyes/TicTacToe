// GAMEBOARD IIFE //
const gameboard = (() => {
  let board = ["X", "X", "O", "O", "", "O", "O", "X", "X"];

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
        console.log(
          `the winner is ${
            first === "X" ? playerOne.getName() : playerTwo.getName()
          }`
        );
        return;
      }
    }

    console.log("There is no winner");

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

  return {
    clearBoard,
    scanForWin,
    resetGame,
    updateScore,
    updateTurn,
    getTurn,
  };
})();

console.log(gameboard.getBoard());

gameController.scanForWin();
// CHECK WINNER BY COLUMN LOGIC //
// const [first, second, third] = gameboard.getBoard().map();
// const [fourth, fifth, sixth] = gameboard.getBoard().slice(3, 3 + 3);
// const [seventh, eight, ninth] = gameboard.getBoard().slice(6, 6 + 3);
