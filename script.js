let playerText = document.querySelector('.winner');
let restartBtn = document.getElementById('restartBtn');
let playWithFriendBtn = document.getElementById('playWithFriendBtn');
let playWithAIBtn = document.getElementById('playWithAIBtn');
let boxes = Array.from(document.getElementsByClassName('box'));

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');

const O_Text = 'O';
const X_Text = 'X';

let currentPlayer = X_Text;
let spaces = Array(9).fill(null);
let gameOver = false; // Flag to indicate if the game is over
let playWithAI = false;

const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked));
}

function boxClicked(e) {
    const id = e.target.id;

    // Check if the game is over, the box is already occupied, or it's not the current player's turn
    if (gameOver || spaces[id] !== null || (playWithAI && currentPlayer === O_Text)) {
        return;
    }

    // Make a move
    spaces[id] = currentPlayer;
    e.target.innerText = currentPlayer;

    // Check for a winner
    let winningBlocks = playerHasWon();
    if (winningBlocks) {
        playerText.innerText = `${currentPlayer} has won`;
        // console.log(winningBlocks);

        winningBlocks.forEach(box => boxes[box].style.backgroundColor = winnerIndicator);
        gameOver = true; // Set the game over flag
        return;
    }

    // Check if the game is a draw
    if (!spaces.includes(null)) {
        playerText.innerText = 'It\'s a draw';
        gameOver = true; // Set the game over flag
        return;
    }

    // Switch to the other player
    currentPlayer = currentPlayer === X_Text ? O_Text : X_Text;

    // If playing against the AI and it's the AI's turn, trigger the AI move
    if (playWithAI && currentPlayer === O_Text) {
        aiMove();
    }
}



function aiMove() {
    let emptySpaces = spaces.map((val, idx) => val === null ? idx : null).filter(val => val !== null);

    // Simple AI: Choose a random empty space
    let move = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];

    if (move !== undefined) {
        spaces[move] = currentPlayer;
        boxes[move].innerText = currentPlayer;

        let winningBlocks = playerHasWon();
        if (winningBlocks) {
            playerText.innerText = `${currentPlayer} has won`;
            // console.log(winningBlocks);

            winningBlocks.forEach(box => boxes[box].style.backgroundColor = winnerIndicator);
            gameOver = true; // Set the game over flag
            return;
        }

        // Check if the game is a draw
        if (!spaces.includes(null)) {
            playerText.innerText = 'It\'s a draw';
            gameOver = true; // Set the game over flag
            return;
        }

        currentPlayer = currentPlayer === X_Text ? O_Text : X_Text;
    }
}

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;

        if (spaces[a] && spaces[a] === spaces[b] && spaces[a] === spaces[c]) {
            return [a, b, c];
        }
    }
    return false;
}

playWithFriendBtn.addEventListener('click', () => {
    playWithAI = false;
    restartGame();
});

playWithAIBtn.addEventListener('click', () => {
    playWithAI = true;
    restartGame();
    if (currentPlayer === O_Text && playWithAI) {
        aiMove();
    } else {
    }
});



restartBtn.addEventListener('click', restartGame);

function restartGame() {
    spaces.fill(null);
    gameOver = false; // Reset the game over flag

    boxes.forEach(box => {
        box.innerText = '';
        box.style.backgroundColor = '';
    });

    playerText.innerText = 'Tic Tac Toe';
    currentPlayer = playWithAI ? O_Text : X_Text;

    if (playWithAI && currentPlayer === O_Text) {
        aiMove();
    }
}

startGame();