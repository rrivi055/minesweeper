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
    board: [],         
    isGameOver: false,
    secondsElapsed: 0,
    timerInterval: null
};

/**
 * Handles left-click on a cell to reveal it.
 * Extracts coordinates from the data attributes and updates the game state.
 * @param {Event} event - The click event object.
 */
const handleCellClick = (event) => {
    const row = parseInt(event.currentTarget.dataset.row);
    const col = parseInt(event.currentTarget.dataset.col);
    if (gameState.isGameOver || gameState.board[row][col].isFlagged) return;
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
    if (gameState.isGameOver || gameState.board[row][col].isRevealed) return;
    gameState.board[row][col].isFlagged = !gameState.board[row][col].isFlagged;
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
    // boardContainer.removeChild(boardContainer.firstChild);
// }
    boardContainer.style.gridTemplateColumns = `repeat(${gameState.cols}, 30px)`;
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('button');
            cellElement.classList.add('cell');
            cellElement.dataset.row = rowIndex;
            cellElement.dataset.col = colIndex;
            cellElement.addEventListener('click', handleCellClick);
            cellElement.addEventListener('contextmenu', handleRightClick);
            boardContainer.appendChild(cellElement);
        });
    });
};
/**
 * Initializes the game state, generates the logical board, 
 * and triggers the initial UI rendering.
 */
const initGame = () => {
    gameState.board = createBoard(gameState.rows, gameState.cols, gameState.minesCount);
    // Reset game state variables if played again
    gameState.isGameOver = false;
    gameState.secondsElapsed = 0;
    renderBoard(gameState.board);
};