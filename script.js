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
  const resetTurn = () => (turn = false);
  return { getName, getMarker, toggleTurn, getTurn, resetTurn };
};

// GAME CONTROLLER IIFE CONTROLS GAME //
const gameController = (() => {
  const game = {
    playerOneScore: 0,
    playerTwoScore: 0,
    winner: "",
    currentMarker: "",
  };

  // GETTER FUNCTIONS //
  const getWinner = () => game.winner;
  const getCurrentMarker = () => game.currentMarker;
  const getDrawState = () => game.isDraw;
  const getScore = () => ({
    p1Score: game.playerOneScore,
    p2Score: game.playerTwoScore,
  });

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
    game.winner = "";
    playerOne.resetTurn();
    playerTwo.resetTurn();
    game.isDraw = false;
    game.currentMarker = "";
  };

  const wipeGame = () => {
    resetGame();
    resetScore();
  };

  const resetScore = () => {
    game.playerOneScore = 0;
    game.playerTwoScore = 0;
  };

  const intializeGame = (playerOne) => {
    playerOne.toggleTurn();
    updateCurrentMarker(playerOne.getMarker());
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

  const startGame = () => {
    let cell = "";
    do {
      cell = prompt("Enter which cell you'd like to mark");
      const board = gameboard.getBoard();
      if (board.at(cell) === "") {
        board.splice(cell, 1, gameController.getCurrentMarker());
        gameboard.updateBoard(board);
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
    return "game-over";
  };

  return {
    resetGame,
    wipeGame,
    scanForWin,
    updateScore,
    getScore,
    getWinner,
    checkForDraw,
    intializeGame,
    getCurrentMarker,
    switchPlayer,
    getDrawState,
    startGame,
  };
})();

const playerOne = newPlayer("Player 1", "X");
const playerTwo = newPlayer("Player 2", "O");
gameController.intializeGame(playerOne);

const cells = Array.from(document.querySelectorAll(".cell"));
const _board = document.querySelector(".board");

_board.addEventListener("click", (e) => {
  if (e.target.closest(".cell")) {
    const cell = e.target.closest(".cell");
    // prohibit placing a marker in an already filled cell
    if (!cell.querySelector(".marker")) {
      // create and append the marker
      const marker = document.createElement("div");
      marker.className = "marker";
      marker.innerText = gameController.getCurrentMarker();
      e.target.append(marker);

      // remove the hover effect
      e.target.querySelector(".hover-box").remove();

      // Update the gameboard
      const cellIdx = e.target.dataset.idx;
      let board = gameboard.getBoard();
      board.splice(cellIdx, 1, gameController.getCurrentMarker());
      gameboard.updateBoard(board);

      // update array tracker
      console.log(cellIdx);
      const box = document.querySelector(`.box-${cellIdx} span`);
      box.innerText = gameController.getCurrentMarker();

      // Check for a win or draw, else toggle marker
      if (gameController.scanForWin()) {
        gameController.updateScore();
        console.log("WIN");
        console.log(gameController.getScore());
      } else if (gameController.checkForDraw()) {
        console.log("Its a draw!");
      } else {
        playerOne.getTurn()
          ? gameController.switchPlayer(playerTwo, playerOne)
          : gameController.switchPlayer(playerOne, playerTwo);
      }
    } else {
      console.log("cell already marked");
    }
  }
});

// when a cell is clicked
// 1. check if the cell has already been clicked. Do not allow user to click a filled cell
// 2. delete the hover effect for that cell
// 3. place the current marker on the clicked cell
// 4. get the index of the cell clicked
// 5. update the gameboard array with the current marker using the index of the clicked cell
// 6. scan for a win. If there is a win, remove the click event listener; and, display winner
// 7. if no win, toggle the current marker

// if (gameController.startGame() === "game-over") {
//   gameController.getDrawState()
//     ? console.log("It's a draw!")
//     : console.log(`${gameController.getWinner()} Wins!`);

//   gameController.updateScore();
//   console.log(
//     `Player 1 Score: ${gameController.getScore().p1Score}\nPlayer 2 Score: ${
//       gameController.getScore().p2Score
//     }`
//   );
// }
