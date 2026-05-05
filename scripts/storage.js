const STORAGE_KEY = 'minesweeper_high_scores';

/**
 * Retrieves all high scores from local storage.
 * @returns {Array<Object>} An array of score objects or an empty array if none exist.
 */
const getAllScores = () => {
    const rawData = localStorage.getItem(STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : [];
};
/**
 * Saves a new game result to local storage.
 * @param {string} playerName - The name of the player.
 * @param {string} level - The game difficulty level (e.g., 'easy', 'normal', 'hard').
 * @param {number} time - The completion time in seconds/milliseconds.
 */
const saveNewScore = (playerName, level, time) => {
    const scores = getAllScores();
    const newResult = {
        name: playerName,
        level: level,
        time: time,
        date: new Date().toLocaleDateString()
    };
    scores.push(newResult);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
};
/**
 * Sorts an array of scores by time in ascending order.
 * @param {Array<Object>} scoresArray - The array of score objects to sort.
 * @returns {Array<Object>} A new sorted array (shallow copy).
 */
const sortScoresByTime = (scoresArray) => {
    return [...scoresArray].sort((a, b) => a.time - b.time);
};
