// GAMEBOARD IIFE //
const gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const updateBoard = (newBoard) => (board = newBoard);
  const getBoard = () => board;

  return { updateBoard, getBoard };
})();

// PLAYER FACTORY //
const newPlayer = function (name, marker) {
  let turn = false;
  const getName = () => name;
  const getMarker = () => marker;
  const toggleTurn = () => (turn = turn ? false : true);
  const getTurn = () => turn;
  return { getName, getMarker, toggleTurn, getTurn };
};

// GAME CONTROLLER IIFE CONTROLS GAME //
const gameController = (() => {
  const game = {
    playerOneScore: 0,
    playerTwoScore: 0,
    winner: "",
    isDraw: false,
    currentMarker: "",
  };

  // GETTER FUNCTIONS //
  const getWinner = () => game.winner;
  const getCurrentMarker = () => game.currentMarker;
  const getDrawState = () => game.isDraw;

  // SETTER FUNCTIONS //
  const clearBoard = () => {
    gameboard.updateBoard(gameboard.getBoard().map(() => ""));
  };

  const updateCurrentMarker = (newMarker) => (game.currentMarker = newMarker);
  const updateScore = () => {
    game.winner === playerOne.getName()
      ? game.playerOneScore++
      : game.playerTwoScore++;
  };

  const resetGame = () => {
    clearBoard();
    resetScore();
    game.winner = "";
  };

  const resetScore = () => {
    game.playerOneScore = 0;
    game.playerTwoScore = 0;
  };

  const intializeGame = (playerOne) => {
    playerOne.toggleTurn();
    updateCurrentMarker(playerOne.getMarker());
    resetGame();
  };

  const switchPlayer = (player, otherPlayer) => {
    player.toggleTurn();
    otherPlayer.toggleTurn();
    updateCurrentMarker(player.getMarker());
  };

  // UTILITY FUNCTIONS //
  const threeInARow = (arr) => {
    if (arr.includes("")) return false;
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
      if (threeInARow([first, second, third])) {
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

      if (threeInARow([first, second, third])) {
        assignWinner(first);
        return true;
      }
    }
    return false;
  };

  const checkDiagonals = (gameboard) => {
    const [zeroth, , , , fourth, , , , eigth] = gameboard.getBoard();
    const [, , second, , , , sixth] = gameboard.getBoard();

    if (threeInARow([zeroth, fourth, eigth])) {
      assignWinner(zeroth);
      return true;
    }

    if (threeInARow([second, fourth, sixth])) {
      assignWinner(second);
      return true;
    }
    return false;
  };

  const scanForWin = () => {
    // scans for a win every time the player/computer adds a marker
    if (
      checkRows(gameboard) ||
      checkCols(gameboard) ||
      checkDiagonals(gameboard)
    ) {
      return true;
    }
    return false;
  };

  const checkForFullBoard = (gameboard) => {
    return gameboard.getBoard().every((cell) => cell !== "");
  };

  const checkForDraw = () => {
    if (checkForFullBoard(gameboard)) {
      game.isDraw = true;
      return true;
    }
    return false;
  };

  return {
    resetGame,
    scanForWin,
    updateScore,
    getWinner,
    checkForDraw,
    intializeGame,
    getCurrentMarker,
    switchPlayer,
    getDrawState,
  };
})();

const playerOne = newPlayer("Player 1", "X");
const playerTwo = newPlayer("Player 2", "O");
gameController.intializeGame(playerOne);

let cell = "";
do {
  cell = prompt("Enter which cell you'd like to mark");
  const board = gameboard.getBoard();
  if (board.at(cell) === "") {
    board.splice(cell, 1, gameController.getCurrentMarker());
    gameboard.updateBoard(board);
    console.log(gameboard.getBoard());
    if (gameController.scanForWin() || gameController.checkForDraw()) {
      break;
    }
    playerOne.getTurn()
      ? gameController.switchPlayer(playerTwo, playerOne)
      : gameController.switchPlayer(playerOne, playerTwo);
  } else {
    console.log("Cannot mark a filled cell");
  }
} while (true);
console.log(
  "Winner: ",
  gameController.getWinner() !== ""
    ? gameController.getWinner()
    : "It's a draw!"
);

if (gameController.getWinner() !== "") {
}
