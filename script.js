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

const playerOne = newPlayer("Player 1", "X");
const playerTwo = newPlayer("Player 2", "O");

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

  const resetGameData = () => {
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

  return {
    resetGameData,
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
  };
})();

const interfaceController = (() => {
  const turnLabel = document.querySelector(".player-turn-display");
  const cap = document.querySelector(".board-cap");
  const backPanel = document.querySelector(".panel-backing");
  const winnerPanel = document.querySelector(".winner-panel");
  const capBacking = document.querySelector(".cap-background");
  const panelRow = document.querySelector(".bp-row");
  const winnerLabel = document.querySelector(".winner-label span");
  let clickedCellIdx = null;
  const displayManager = {
    updateTurnDisplay: () => {
      turnLabel.innerText = `TURN: ${
        gameController.getCurrentMarker() === "X"
          ? playerOne.getName()
          : playerTwo.getName()
      }`;
      return this;
    },
    updateScoreDisplay: () => {
      gameController.updateScore();
      const winnerNum = parseInt(gameController.getWinner().at(-1));
      const scoreLabel = document.querySelector(
        `.player${winnerNum} .player-score`
      );
      scoreLabel.innerText =
        winnerNum === 1
          ? gameController.getScore().p1Score
          : gameController.getScore().p2Score;
      return this;
    },
    hideHoverBox: (e) => {
      e.target.querySelector(".hover-box").classList.add("hide");
    },
    showHoverBoxes: () => {
      document
        .querySelectorAll(".hover-box")
        .forEach((box) => box.classList.remove("hide"));
    },
    animateEndGame: () => {
      playAgainButton.disabled = true;
      playAgainButton.classList.remove("hide");
      panelRow.classList.add("slide-down");
      winnerPanel.classList.add("fade-in");
      backPanel.classList.add("expand-down");
      cap.classList.add("board-cap-animate");
      panelRow.addEventListener(
        "animationend",
        () => {
          winnerLabel.classList.add("blink");
          playAgainButton.disabled = false;
        },
        { once: true }
      );
    },
    animateNewGame: () => {
      panelRow.classList.add("slide-down-reverse");
      winnerPanel.classList.add("fade-in-reverse");
      backPanel.classList.add("expand-down-reverse");
      capBacking.classList.add("board-cap-animate-reverse");
    },
    cleanUpAnimations: () => {
      turnLabel.classList.add("board-cap-fade-in");
      cap.classList.remove("board-cap-animate");
      capBacking.classList.remove("board-cap-animate-reverse");
      backPanel.classList.remove("expand-down");
      backPanel.classList.remove("expand-down-reverse");
      winnerPanel.classList.remove("fade-in");
      winnerPanel.classList.remove("fade-in-reverse");
      playAgainButton.classList.add("hide");
      panelRow.classList.remove("slide-down");
      panelRow.classList.remove("slide-down-reverse");
      winnerLabel.classList.remove("blink");
      turnLabel.addEventListener(
        "animationend",
        () => {
          turnLabel.classList.remove("board-cap-fade-in");
        },
        { once: true }
      );
    },
    updateWinnerLabel: () => {
      console.log(gameController.getWinner());
      winnerLabel.innerText =
        gameController.getWinner() === ""
          ? "IT'S A DRAW"
          : `WINNER: ${gameController.getWinner()}`;
    },
  };

  const appendMarker = (e) => {
    const marker = document.createElement("div");
    marker.className = "marker";
    marker.innerText = gameController.getCurrentMarker();
    e.target.append(marker);
  };

  const updateGameboard = (e) => {
    const cellIdx = e.target.dataset.idx;
    clickedCellIdx = cellIdx;
    let board = gameboard.getBoard();
    board.splice(cellIdx, 1, gameController.getCurrentMarker());
    gameboard.updateBoard(board);
  };

  const updateArrayTracker = () => {
    const box = document.querySelector(`.box-${clickedCellIdx} span`);
    box.innerText = gameController.getCurrentMarker();
  };

  const clearCells = (elements) => {
    elements.forEach((element, i) => {
      setTimeout(() => {
        element.innerText = "";
      }, i * 100);
    });
  };

  const deleteMarkers = (elements) => {
    elements.forEach((element, i) => {
      setTimeout(() => {
        element.remove();
      }, i * 100);
    });
  };

  const updateMarker = () => {
    playerOne.getTurn()
      ? gameController.switchPlayer(playerTwo, playerOne)
      : gameController.switchPlayer(playerOne, playerTwo);
    displayManager.updateTurnDisplay();
  };

  const resetGame = () => {
    playAgainButton.disabled = true;
    const markers = document.querySelectorAll(".cell .marker");
    const arrTrackerCells = document.querySelectorAll(".array-tracker span");
    gameController.resetGameData();
    deleteMarkers(markers);
    clearCells(arrTrackerCells);
    gameController.intializeGame(playerOne);
    setTimeout(() => {
      displayManager.showHoverBoxes();
      playingBoard.addEventListener("click", handleCellClick);
    }, 900);
  };

  const handleNewGame = () => {
    displayManager.animateNewGame();
    setTimeout(() => {
      displayManager.cleanUpAnimations();
      resetGame();
    }, 1750);
  };

  const endGame = () => {
    playingBoard.removeEventListener("click", handleCellClick);
    playAgainButton.disabled = true;
    displayManager.animateEndGame();
    displayManager.updateWinnerLabel();
  };

  const gameOver = () => {
    if (gameController.scanForWin()) {
      displayManager.updateScoreDisplay();
      endGame();
      return true;
    } else if (gameController.checkForDraw()) {
      endGame();
      return true;
    }
    return false;
  };

  const handleCellClick = (e) => {
    if (e.target.closest(".cell")) {
      const cell = e.target.closest(".cell");
      if (!cell.querySelector(".marker")) {
        appendMarker(e);
        displayManager.hideHoverBox(e);
        updateGameboard(e);
        updateArrayTracker();

        if (!gameOver()) {
          updateMarker();
        }
      } else {
        console.log("cell already marked");
      }
    }
  };

  return {
    handleCellClick,
    handleNewGame,
  };
})();

gameController.intializeGame(playerOne);
const playingBoard = document.querySelector(".board");
playingBoard.addEventListener("click", interfaceController.handleCellClick);
const playAgainButton = document.querySelector(".play-again");
playAgainButton.addEventListener("click", interfaceController.handleNewGame);
