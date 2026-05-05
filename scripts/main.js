import { createBoard } from './gameLogic.js';
import { revealCell } from './gameLogic.js';
import { checkWinCondition } from './gameLogic.js';

const urlParams = new URLSearchParams(window.location.search);

const nameFromUrl = urlParams.get('userName'); 
const levelFromUrl = urlParams.get('level');   

if (!nameFromUrl || !levelFromUrl) {
    window.location.href = 'index.html';
}

const getSettings = (level) => {
    const levels = {
        'easy': { rows: 9, cols: 9, mines: 10 },
        'normal': { rows: 16, cols: 16, mines: 40 },
        'hard': { rows: 16, cols: 30, mines: 99 }
    };
    return levels[level] || levels['easy'];
};

const currentLevelSettings = getSettings(levelFromUrl);

const gameState = {
    playerName: nameFromUrl || 'Guest',
    difficulty: levelFromUrl || 'easy',
    rows: currentLevelSettings.rows,
    cols: currentLevelSettings.cols,
    minesCount: currentLevelSettings.mines,
    flagsUsed: 0,
    board: [],         
    isGameOver: false,
    secondsElapsed: 0,
    timerInterval: null
};

/**
 * Updates the visual statistics on the screen.
 * Synchronizes the timer and the remaining mines counter with the gameState.
 */
const updateStats = () => {
    const minesCountElement = document.querySelector('#mines-count');
    if (minesCountElement) {
        const remainingMines = gameState.minesCount - gameState.flagsUsed;
        minesCountElement.textContent = remainingMines;
    }
    const timerElement = document.querySelector('#timer');
    if (timerElement) {
        timerElement.textContent = gameState.secondsElapsed;
    }
};
/**
 * Handles left-click on a cell to reveal it.
 * Extracts coordinates from the data attributes and updates the game state.
 * @param {Event} event - The click event object.
 */
const handleCellClick = (event) => {
    const row = parseInt(event.currentTarget.dataset.row);
    const col = parseInt(event.currentTarget.dataset.col);
    const cell = gameState.board[row][col];
    if (gameState.isGameOver || cell.isRevealed || cell.isFlagged) return;
    revealCell(gameState.board, row, col);
    renderBoard(gameState.board);
};
/**
 * Handles right-click on a cell to toggle a flag.
 * Prevents the default context menu from appearing.
 * @param {Event} event - The contextmenu event object.
 */
const handleRightClick = (event) => {
    event.preventDefault();
    const row = parseInt(event.currentTarget.dataset.row);
    const col = parseInt(event.currentTarget.dataset.col);
    const cell = gameState.board[row][col];
    if (gameState.isGameOver || cell.isRevealed) return;
    if (!cell.isFlagged) {
        cell.isFlagged = true;
        gameState.flagsUsed++;
    } else {
        cell.isFlagged = false;
        gameState.flagsUsed--;
    }
    updateStats();
    renderBoard(gameState.board);
};
/**
 * Renders the game board by creating DOM elements for each cell.
 * Clears the existing board and attaches event listeners to each new cell.
 * @param {Array<Array<Object>>} board - The 2D array representing the logical board.
 */
const renderBoard = (board) => {
    const boardContainer = document.querySelector('#game-board');
    boardContainer.innerHTML = '';
    // another option if last line is problematic by teacher's standards:
    // while (boardContainer.firstChild) {
    //  boardContainer.removeChild(boardContainer.firstChild);
// }
    boardContainer.style.gridTemplateColumns = `repeat(${gameState.cols}, 30px)`;
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('button');
            cellElement.classList.add('cell');
            cellElement.dataset.row = rowIndex;
            cellElement.dataset.col = colIndex;
            if (cell.isRevealed) {
                cellElement.classList.add('revealed');
                // כאן תבוא לוגיקה נוספת להצגת מספר המוקשים מסביב
            } else if (cell.isFlagged) {
                cellElement.textContent = '🚩';
                cellElement.classList.add('flagged');
            }
            cellElement.addEventListener('click', handleCellClick);
            cellElement.addEventListener('contextmenu', handleRightClick);
            boardContainer.appendChild(cellElement);
        });
    });
};
/**
 * Resets the game state variables to their default values.
 * Clears any active timers and prepares the state for a new game session.
 */
const resetGameState = () => {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
    gameState.secondsElapsed = 0;
    gameState.flagsUsed = 0;
    gameState.isGameOver = false;
    gameState.board = [];
};
/**
 * Initializes the game state, generates the logical board, 
 * and triggers the initial UI rendering.
 */
const initGame = () => {
    resetGameState();
    gameState.board = createBoard(gameState.rows, gameState.cols, gameState.minesCount);
    updateStats();
    renderBoard(gameState.board);
};