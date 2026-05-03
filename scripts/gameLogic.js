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
