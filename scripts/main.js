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

