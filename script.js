// GAMEBOARD IIFE //
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const updateBoard = (newBoard) => (board = newBoard);
  const getBoard = () => board;

  return { updateBoard, getBoard };
})();

// PLAYER FACTORY //
const NewPlayer = function (name, marker) {
  let turn = false;
  const getName = () => name;
  const getMarker = () => marker;
  const toggleTurn = () => (turn = turn ? false : true);
  const getTurn = () => turn;
  const resetTurn = () => (turn = false);
  return { getName, getMarker, toggleTurn, getTurn, resetTurn };
};

const playerOne = NewPlayer("Player 1", "X");
const playerTwo = NewPlayer("Player 2", "O");

// GAME CONTROLLER IIFE CONTROLS GAME //
const GameController = (() => {
  const game = {
    playerOneScore: 0,
    playerTwoScore: 0,
    winner: "",
    currentMarker: "",
    currentPlayer: "",
  };

  // GETTER FUNCTIONS //
  const getWinner = () => game.winner;
  const getCurrentPlayer = () => game.currentPlayer;
  const getCurrentMarker = () => game.currentMarker;
  const getDrawState = () => game.isDraw;
  const getScore = () => ({
    p1Score: game.playerOneScore,
    p2Score: game.playerTwoScore,
  });

  // SETTER FUNCTIONS //
  const clearBoard = () => {
    Gameboard.updateBoard(Gameboard.getBoard().map(() => ""));
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

  const resetCurrentPlayer = () => (game.currentPlayer = "Player 1");

  const wipeGame = () => {
    resetGameData();
    resetScore();
  };

  const resetScore = () => {
    game.playerOneScore = 0;
    game.playerTwoScore = 0;
  };

  const intializeGame = (playerOne) => {
    [playerOne, playerTwo].forEach((player) => player.resetTurn());
    playerOne.toggleTurn();
    resetCurrentPlayer();
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

  const checkRows = (Gameboard) => {
    for (let i = 0; i < Gameboard.getBoard().length; i += 3) {
      const [first, second, third] = Gameboard.getBoard().slice(i, i + 3);
      if (threeInARow([first, second, third])) {
        assignWinner(first);
        return true;
      }
    }
    return false;
  };

  const checkCols = (Gameboard) => {
    for (let i = 0; i < 3; i++) {
      const idx_1 = i;
      const idx_2 = idx_1 + 3;
      const idx_3 = idx_2 + 3;
      const first = Gameboard.getBoard().slice(idx_1, idx_1 + 1)[0];
      const second = Gameboard.getBoard().slice(idx_2, idx_2 + 1)[0];
      const third = Gameboard.getBoard().slice(idx_3, idx_3 + 1)[0];

      if (threeInARow([first, second, third])) {
        assignWinner(first);
        return true;
      }
    }
    return false;
  };

  const checkDiagonals = (Gameboard) => {
    const [zeroth, , , , fourth, , , , eigth] = Gameboard.getBoard();
    const [, , second, , , , sixth] = Gameboard.getBoard();

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
      checkRows(Gameboard) ||
      checkCols(Gameboard) ||
      checkDiagonals(Gameboard)
    ) {
      return true;
    }
    return false;
  };

  const checkForFullBoard = (Gameboard) => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  const checkForDraw = () => {
    if (checkForFullBoard(Gameboard)) {
      game.isDraw = true;
      return true;
    }
    return false;
  };

  return {
    resetGameData,
    scanForWin,
    updateScore,
    getScore,
    getWinner,
    checkForDraw,
    intializeGame,
    getCurrentMarker,
    getCurrentPlayer,
    switchPlayer,
    getDrawState,
  };
})();

const displayManager = (() => {
  const turnLabel = document.querySelector(".player-turn-display");
  const cap = document.querySelector(".board-cap");
  const backPanel = document.querySelector(".panel-backing");
  const winnerPanel = document.querySelector(".winner-panel");
  const winnerPanelText = document.querySelector(".winner-panel span");
  const capBacking = document.querySelector(".cap-background");
  const panelRow = document.querySelector(".bp-row");
  const winnerLabel = document.querySelector(".winner-label span");
  const decorativeText = Array.from(
    document.querySelectorAll(".board-cap > div:nth-child(-n+4)")
  );
  const bars = Array.from(document.querySelectorAll(".bar"));

  const printWinnerPanelText = () => {
    let endIndex = 0;
    const speed = 5;
    const numberOfDecimals = 15;
    let charsPerFrame = 1;
    lastFrameTime = performance.now();

    const moveSet = (() => {
      const joinedMoves = InterfaceController.getMoveOrder()
        .map(({ cellIdx, currentMarker }, i, arr) =>
          i === arr.length - 1
            ? `//move_${i}-${currentMarker}${".".repeat(
                numberOfDecimals
              )}cell_${cellIdx}`
            : `//move_${i}-${currentMarker}${".".repeat(
                numberOfDecimals
              )}cell_${cellIdx}\n`
        )
        .join("");
      return [joinedMoves];
    })();

    let message =
      `//assets retrieved\n//term_attempt_1\n//term_attempt_2\n//term_attempt_3\n//term_success\n${moveSet}`.toUpperCase();

    return (typewriter = () => {
      const frameStart = performance.now();
      if (frameStart - lastFrameTime > 20) {
        charsPerFrame = Math.min(charsPerFrame + 1, 5);
      }

      endIndex = Math.min(endIndex + charsPerFrame, message.length);
      winnerPanelText.innerText = message.substring(0, endIndex);
      lastFrameTime = frameStart;

      if (endIndex++ !== message.length) {
        setTimeout(typewriter, speed);
      } else {
        [winnerLabel, winnerPanelText].forEach((element) =>
          element.classList.add("blink")
        );
        winnerLabel.addEventListener("animationend", () => {
          playAgainButton.disabled = false;
        });
      }
    });
  };

  const updateTurnDisplay = () => {
    turnLabel.innerText = `TURN: ${
      GameController.getCurrentMarker() === "X"
        ? playerOne.getName()
        : playerTwo.getName()
    }`;
  };
  const updateScoreDisplay = () => {
    GameController.updateScore();
    const winnerNum = parseInt(GameController.getWinner().at(-1));
    const scoreLabel = document.querySelector(
      `.player${winnerNum} .player-score`
    );
    scoreLabel.innerText =
      winnerNum === 1
        ? GameController.getScore().p1Score
        : GameController.getScore().p2Score;
  };
  const hideHoverBox = (e) => {
    e.target.querySelector(".hover-box").classList.add("hide");
  };
  const showHoverBoxes = () => {
    document
      .querySelectorAll(".hover-box")
      .forEach((box) => box.classList.remove("hide"));
  };
  const animateEndGame = () => {
    playAgainButton.disabled = true;
    playAgainButton.classList.remove("hide");

    const classes = [
      { element: panelRow, _class: "slide-down" },
      { element: winnerPanel, _class: "fade-in" },
      { element: backPanel, _class: "expand-down" },
      { element: cap, _class: "board-cap-animate" },
    ];

    classes.forEach(({ element, _class }) => {
      element.classList.add(_class);
    });

    cap.addEventListener(
      "animationend",
      () => {
        decorativeText.forEach((text) => {
          text.classList.add("board-cap-fade-in");
        });
      },
      { once: true }
    );

    backPanel.addEventListener(
      "animationend",
      () => {
        printWinnerPanelText()();
      },
      { once: true }
    );
  };
  const animateNewGame = () => {
    const classes = [
      { element: panelRow, _class: "slide-down-reverse" },
      { element: winnerPanel, _class: "fade-in-reverse" },
      { element: backPanel, _class: "expand-down-reverse" },
      { element: capBacking, _class: "board-cap-animate-reverse" },
    ];

    classes.forEach(({ element, _class }) => {
      element.classList.add(_class);
    });

    winnerPanel.addEventListener(
      "animationend",
      () => {
        winnerPanelText.innerText = "";
      },
      { once: true }
    );
  };
  const cleanUpAnimations = () => {
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
    winnerPanelText.classList.remove("blink");

    decorativeText.forEach((text) => {
      text.classList.remove("board-cap-fade-in");
    });

    turnLabel.addEventListener(
      "animationend",
      () => {
        turnLabel.classList.remove("board-cap-fade-in");
      },
      { once: true }
    );
  };
  const updateWinnerLabel = () => {
    winnerLabel.innerText =
      GameController.getWinner() === ""
        ? "IT'S A DRAW"
        : `WINNER: ${GameController.getWinner()}`;
  };

  //ANIMATE BARS IMMEDIATELY
  (() => {
    setInterval(() => {
      bars.forEach((bar, i) => {
        setTimeout(() => {
          bar.classList.add("bar-slide-up");
        }, i * 100);
      });

      let idx = 0;
      setTimeout(() => {
        for (let i = bars.length - 1; i >= 0; i--) {
          setTimeout(() => {
            bars[i].classList.add("bar-slide-down");
          }, idx * 100);
          idx++;
        }
      }, 1500);

      function handleLastAnimation(e) {
        if (e.animationName === "slideDown") {
          bars.forEach((bar) => {
            bar.classList.remove("bar-slide-up", "bar-slide-down");
          });
          bars[0].removeEventListener("animationend", handleLastAnimation);
        }
      }

      bars[0].addEventListener("animationend", handleLastAnimation);
    }, 12000);
  })();

  return {
    updateTurnDisplay,
    showHoverBoxes,
    animateNewGame,
    cleanUpAnimations,
    animateEndGame,
    updateWinnerLabel,
    updateScoreDisplay,
    hideHoverBox,
  };
})();

const InterfaceController = (() => {
  let moveOrder = [];
  let clickedCellIdx = null;

  const appendMarker = (e) => {
    const marker = document.createElement("div");
    marker.className = "marker";
    marker.innerText = GameController.getCurrentMarker();
    e.target.append(marker);
  };

  const updateGameboard = (e) => {
    const cellIdx = e.target.dataset.idx;
    clickedCellIdx = cellIdx;
    let board = Gameboard.getBoard();
    let currentMarker = GameController.getCurrentMarker();
    board.splice(cellIdx, 1, currentMarker);
    Gameboard.updateBoard(board);
    moveOrder.push({ cellIdx, currentMarker });
  };

  const updateArrayTracker = () => {
    const box = document.querySelector(`.box-${clickedCellIdx} span`);
    box.innerText = GameController.getCurrentMarker();
    box.classList.add("marked");
  };

  const clearMarkers = () => {
    const markers = document.querySelectorAll(".cell .marker");
    const arrTrackerCells = document.querySelectorAll(".array-tracker span");
    [...markers, ...arrTrackerCells].forEach((element, i) => {
      setTimeout(() => {
        if (element.className === "marker") {
          element.remove();
        } else {
          element.innerText = "";
          element.classList.remove("marked");
        }
      }, i * 45);
    });
  };

  const updateMarker = () => {
    playerOne.getTurn()
      ? GameController.switchPlayer(playerTwo, playerOne)
      : GameController.switchPlayer(playerOne, playerTwo);
    displayManager.updateTurnDisplay();
  };

  const resetGame = () => {
    playAgainButton.disabled = true;
    GameController.resetGameData();
    GameController.intializeGame(playerOne);
    displayManager.updateTurnDisplay();
    clearMarkers();
    moveOrder = [];
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
    if (GameController.scanForWin()) {
      displayManager.updateScoreDisplay();
      endGame();
      return true;
    } else if (GameController.checkForDraw()) {
      endGame();
      return true;
    }
    return false;
  };

  const handleCellClick = (e) => {
    const cell = e.target.closest(".cell");
    if (!cell) return;

    if (cell.querySelector(".marker")) {
      cell.classList.add("flash-red");
      cell.addEventListener("animationend", () => {
        cell.classList.remove("flash-red");
      });
      return;
    }

    appendMarker(e);
    updateGameboard(e);
    updateArrayTracker();
    displayManager.hideHoverBox(e);

    if (!gameOver()) updateMarker();
  };

  const getMoveOrder = () => moveOrder;

  return {
    handleCellClick,
    handleNewGame,
    getMoveOrder,
  };
})();

GameController.intializeGame(playerOne);
const playingBoard = document.querySelector(".board");
playingBoard.addEventListener("click", InterfaceController.handleCellClick);
const playAgainButton = document.querySelector(".play-again");
playAgainButton.addEventListener("click", InterfaceController.handleNewGame);
