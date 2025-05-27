// GAMEBOARD IIFE //
const gameboard = (() => {
  let board = ["", "", "O", "", "O", "", "O", "", ""];

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

  const arrIsMatching = (arr) => {
    return arr.every((cell, i, arr) => cell === arr[0]);
  };

  const assignWinner = (first) => {
    game.winner =
      first === playerOne.getMarker()
        ? playerOne.getName()
        : playerTwo.getName();
  };

  const checkRows = (gameboard) => {
    for (let i = 0; i < gameboard.getBoard().length; i += 3) {
      const [first, second, third] = gameboard.getBoard().slice(i, i + 3);
      if (arrIsMatching([first, second, third])) {
        assignWinner(first);
        return true;
      }
    }
    return false;
  };

  const checkCols = (gameboard) => {
    for (let i = 0; i < 3; i++) {
      const idx_1 = i;
      const idx_2 = idx_1 + 3;
      const idx_3 = idx_2 + 3;
      const first = gameboard.getBoard().slice(idx_1, idx_1 + 1)[0];
      const second = gameboard.getBoard().slice(idx_2, idx_2 + 1)[0];
      const third = gameboard.getBoard().slice(idx_3, idx_3 + 1)[0];

      if (arrIsMatching([first, second, third])) {
        assignWinner(first);
        return true;
      }
    }
    return false;
  };

  const checkDiagonals = (gameboard) => {
    const [zeroth, , , , fourth, , , , eigth] = gameboard.getBoard();
    const [, , second, , , , sixth] = gameboard.getBoard();

    if (arrIsMatching([zeroth, fourth, eigth])) {
      assignWinner(zeroth);
      return true;
    }

    if (arrIsMatching([second, fourth, sixth])) {
      assignWinner(second);
      return true;
    }
    return false;
  };

  const scanForWin = () => {
    // scans every time the player/computer add a marker
    if (
      checkRows(gameboard) ||
      checkCols(gameboard) ||
      checkDiagonals(gameboard)
    ) {
      return true;
    }
    return false;
  };

  const clearBoard = () => {
    gameboard.updateBoard(gameboard.getBoard().map(() => ""));
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
