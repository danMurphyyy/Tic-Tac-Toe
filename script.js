const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return {getBoard, setCell, reset};
})();

const player = (name, marker) => {
  return {name, marker};
};

const gameController = (() => {
  const player1 = player("Player 1", "X");
  const player2 = player("Player 2", "O");
  let player1Score = 0;
  let player2Score = 0;
  let activePlayer = player1;

  const getScores = () => {
    return {player1Score, player2Score};
  }

  const switchPlayer = () => {
    if (activePlayer === player1) {
      activePlayer = player2;
    } else {
      activePlayer = player1;
    }
  }

  const resetPlayerScores = () => {
    player1Score = 0;
    player2Score = 0;
  }

  const playRound = (index) => {
    if (gameBoard.setCell(index, activePlayer.marker)) {
      if (checkWinner()) {
        console.log(`${activePlayer.name} wins!`);
        if(activePlayer === player1) player1Score++;
        else player2Score++;
      } else {
        switchPlayer();
      }
    } else {
      console.log("Cell already taken");
    }
  };

  const checkWinner = () => {
    const b = gameBoard.getBoard();
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // columns
      [0,4,8],[2,4,6]          // diagonals
    ];
    return winPatterns.some(pattern =>
      pattern.every(index => b[index] === activePlayer.marker)
    );
  };

  return {playRound, resetPlayerScores, getScores};
})();

const displayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const resetBoardButton = document.getElementById("reset-board");
  const resetGameButton = document.getElementById("reset-game");

  resetBoardButton.addEventListener("click", () => {
    gameBoard.reset();
    render();
  });

  resetGameButton.addEventListener("click", () => {
    gameBoard.reset();
    gameController.resetPlayerScores();
    render();
  })

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      gameController.playRound(index);
      render();
    });
  });

  const render = () => {
    const p1Score = document.getElementById("player-1-score");
    const p2Score = document.getElementById("player-2-score");
    const board = gameBoard.getBoard();

    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });

    const scores = gameController.getScores();
    p1Score.textContent = scores.player1Score;
    p2Score.textContent = scores.player2Score;
  };

  return {render};
})();