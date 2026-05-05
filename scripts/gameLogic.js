/**
 * Creates a 2D array representing the game board.
 * @param {number} rows - The number of rows in the board.
 * @param {number} cols - The number of columns in the board.
 * @returns {Array<Array<Object>>} A 2D array of cell objects.
 */
export const createBoard = (rows, cols) => {
    const board = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push({
                row: i,
                col: j,
                isMine: false,      
                isRevealed: false,  
                isFlagged: false,   
                neighborMines: 0    
            });
        }
        board.push(row);
    }

    return board;
};
/**
 * Randomly places mines on the board, ensuring the first clicked cell is safe.
 * @param {Array<Array<Object>>} board - The game board.
 * @param {number} minesCount - Number of mines to place.
 * @param {Object} firstClickCoords - Coordinates of the first click { row, col }.
 */
export const plantMines = (board, minesCount, firstClickCoords) => {
    let planted = 0;
    const rows = board.length;
    const cols = board[0].length;

    while (planted < minesCount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        const isFirstClick = (r === firstClickCoords.row && c === firstClickCoords.col);

        if (!board[r][c].isMine && !isFirstClick) {
            board[r][c].isMine = true;
            planted++;
        }
    }
};

/**
 * Returns an array of all neighboring cells for a given coordinate.
 * @param {Array<Array<Object>>} board - The game board.
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @returns {Array<Object>} An array of neighboring cell objects.
 */
export const getNeighbors = (board, row, col) => {
    const neighbors = [];
    const rows = board.length;
    const cols = board[0].length;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                neighbors.push(board[newRow][newCol]);
            }
        }
    }

    return neighbors;
};
/**
 * Iterates through the board and updates the neighborMines count for each cell.
 * @param {Array<Array<Object>>} board - The game board.
 */
export const countAdjacentMines = (board) => {
    board.forEach((row) => {
        row.forEach((cell) => {
            if (cell.isMine) return;
            const neighbors = getNeighbors(board, cell.row, cell.col);
            const mineNeighbors = neighbors.filter(neighbor => neighbor.isMine);
            cell.neighborMines = mineNeighbors.length;
        });
    });
};
/**
 * Reveals a cell and its neighbors recursively if the cell has no adjacent mines.
 * @param {Array<Array<Object>>} board - The game board.
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 */
export const revealCell = (board, row, col) => {
    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged) return;
    cell.isRevealed = true;
    if (cell.isMine || cell.neighborMines > 0) return;
    const neighbors = getNeighbors(board, row, col);
    neighbors.forEach(neighbor => {
        revealCell(board, neighbor.row, neighbor.col);
    });
};
/**
 * Starts the game timer if it's not already running.
 * Increments the elapsed seconds in the state every 1000ms and triggers a callback function.
 * @param {Object} state - The current game state object.
 * //@param {number} state.timerInterval - The ID of the current interval (or null).
 * //@param {number} state.secondsElapsed- The total seconds passed since the start.
 * @param {Function} onTick - A callback function to be executed on every tick (e.g., to update the UI).
 */
export const startTimer = (state, onTick) => {
    if (state.timerInterval) return;
    state.timerInterval = setInterval(() => {
        state.secondsElapsed++;
        onTick();
    }, 1000);
};
/**
 * Stops the game timer and resets the interval ID in the state.
 * @param {Object} state - The game state object to be updated.
 * //@param {number} state.timerInterval - The ID of the current interval (or null).
 */
export const stopTimer = (state) => {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
};
/**
 * Checks if the player has won the game by comparing the number of hidden cells to the mine count.
 * @param {Array<Array<Object>>} board - The game board.
 * @param {number} minesCount - The total number of mines in the game.
 * @returns {boolean} True if the player has won, false otherwise.
 */
export const checkWinCondition = (board, minesCount) => {
    const hiddenCells = board.flat().filter(cell => !cell.isRevealed);
    return hiddenCells.length === minesCount;
};
/**
 * Retrieves the configuration settings for a specific game difficulty level.
 * @param {string} level - The difficulty level chosen by the user (e.g., 'easy', 'normal', 'hard').
 * @returns {Object} An object containing the game board configuration:
 * @property {number} rows - The number of rows for the selected level.
 * @property {number} cols - The number of columns for the selected level.
 * @property {number} mines - The total number of mines to be placed on the board.
 * @example
 * // Returns { rows: 9, cols: 9, mines: 10 }
 * getSettings('easy');
 */
export const getSettings = (level) => {
    const levels = {
        'easy': { rows: 9, cols: 9, mines: 10 },
        'normal': { rows: 16, cols: 16, mines: 40 },
        'hard': { rows: 16, cols: 30, mines: 99 }
    };
    return levels[level] || levels['easy'];
};