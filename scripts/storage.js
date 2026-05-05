const STORAGE_KEY = 'minesweeper_high_scores';

/**
 * Retrieves all high scores from local storage.
 * @returns {Array<Object>} An array of score objects or an empty array if none exist.
 */
const getAllScores = () => {
    const rawData = localStorage.getItem(STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : [];
};
