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