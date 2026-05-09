import { createBoard,plantMines, countAdjacentMines,revealCell,startTimer,stopTimer,resetGameState,
    checkWinCondition,getSettings,formatTime,handleWinLogic,DIFFICULTY_ORDER } from './gameLogic.js';
import { playWinSound, playLoseSequence } from './audio.js';

const urlParams = new URLSearchParams(window.location.search);

const nameFromUrl = urlParams.get('userName'); 
const levelFromUrl = urlParams.get('level');   

if (!nameFromUrl || !levelFromUrl) {
    window.location.href = '../index.html';
}

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
            cellElement.tabIndex = 0; 
            if (cell.isRevealed) {
                cellElement.classList.add('revealed');
                if (cell.isMine) {
                    cellElement.textContent = '💣';
                    cellElement.classList.add('mine');
                } else if (cell.neighborMines > 0) {
                    cellElement.textContent = cell.neighborMines;
                    cellElement.classList.add(`mines-${cell.neighborMines}`);
                }
            } else if (cell.isFlagged) {
                cellElement.textContent = '🚩';
                cellElement.classList.add('flagged');
            }
            cellElement.addEventListener('click', handleCellClick);
            cellElement.addEventListener('contextmenu', handleRightClick);
            cellElement.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    handleCellClick(event);
                } else if (event.key === ' ' || event.code === 'Space') { 
                    handleRightClick(event);
                }
            });
            boardContainer.appendChild(cellElement);
        });
    });
};
/**
 * Updates the difficulty level display in the UI.
 * Syncs the text with the current gameState and capitalizes it.
 */
const updateDifficultyDisplay = () => {
    const level = gameState.difficulty;
    const displayElement = document.querySelector('#difficulty-display');
    if (displayElement) {
        displayElement.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    }
};
/**
 * Updates the visual statistics on the screen.
 * Synchronizes the timer, remaining mines counter-flags left with the gameState.
 */
const updateStats = () => {
    const minesCountElement = document.querySelector('#mines-count');
    if (minesCountElement) {
        const remainingMines = gameState.minesCount - gameState.flagsUsed;
        minesCountElement.textContent = remainingMines;
    }
    const timerElement = document.querySelector('#timer');
    if (timerElement) {
        timerElement.textContent = formatTime(gameState.secondsElapsed);
    }
};
/**
 * Handles the game over state when a player loses.
 * Stops the timer, reveals all mines on the board, and re-renders the UI.
 */
const handleGameOver = () => {
    stopTimer(gameState); 
    gameState.isGameOver = true;
    gameState.board.flat().forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
    });
    playLoseSequence();
    renderBoard(gameState.board); 
    const loseModal = document.querySelector('#lose-modal');
    if (loseModal) {
        loseModal.style.display = 'flex'; 
    }
};
/**
 * Handles the game completion logic when a player wins.
 * Executes victory logic and prepares the win notification.
 */
const handleWin = () => {
    handleWinLogic(gameState); 
    playWinSound();
    const winModal = document.querySelector('#win-modal');
    if (winModal) {
        winModal.style.display = 'flex';
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
    if (gameState.secondsElapsed === 0 && !gameState.timerInterval) {
        startTimer(gameState,updateStats);
        plantMines(gameState.board, gameState.minesCount, { row, col });
        countAdjacentMines(gameState.board);
    }
    revealCell(gameState.board, row, col);
    if (cell.isMine) {
        handleGameOver();
        return;
    } else {
        if (checkWinCondition(gameState.board, gameState.minesCount)) {
            handleWin();
        }
    }
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
        if (gameState.flagsUsed >= gameState.minesCount) {
            return; 
        }
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
 * Initializes the game events by attaching listeners to static DOM elements.
 * Ensures buttons like 'restart' and 'home' are functional upon page load.
 * @returns {void}
 */
const setupEventListeners = () => {
    document.querySelectorAll('.restart-btn').forEach(element => {
        element.addEventListener('click', initGame);
    });
    const nextLevelBtn = document.querySelector('#next-level-btn');
    if (nextLevelBtn) {
        nextLevelBtn.addEventListener('click', goToNextLevel);
    }
    document.querySelectorAll('.close-x').forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.target.closest('.modal-overlay').style.display = 'none';
        });
    });
};
/**
 * Initializes the game state, generates the logical board, 
 * and triggers the initial UI rendering.
 */
const initGame = () => {
    setupEventListeners();
    updateDifficultyDisplay(); 
    resetGameState(gameState);
    gameState.board = createBoard(gameState.rows, gameState.cols, gameState.minesCount);
    updateStats();
    renderBoard(gameState.board);
};
/**
 * Advances the game to the next difficulty level.
 * Updates gameState settings, re-initializes the board, 
 * and syncs the URL parameters without a page reload.
 */
const goToNextLevel = () => {
    const currentIndex = DIFFICULTY_ORDER.indexOf(gameState.difficulty);
    const nextLevel = DIFFICULTY_ORDER[currentIndex + 1]|| gameState.difficulty;
    if (!nextLevel) {
        initGame();
        return;
    }
    const newSettings = getSettings(nextLevel);
    gameState.difficulty = nextLevel;
    gameState.rows = newSettings.rows;
    gameState.cols = newSettings.cols;
    gameState.minesCount = newSettings.mines;
    initGame();
    const newUrl = `?userName=${gameState.playerName}&level=${nextLevel}`;
    window.history.pushState({}, '', newUrl);
};
document.addEventListener('DOMContentLoaded', initGame);