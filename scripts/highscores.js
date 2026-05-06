import{getAllScores, sortScoresByTime,getCurrentPlayer, getFilteredScores} from './storage.js'

/**
 * Renders high score cards into the provided container.
 * @param {Array<Object>} scores - Array of score objects to display.
 * @param {HTMLElement} container - The DOM element where cards will be appended.
 */
const renderScoreCards = (scores,container) => {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    if (scores.length === 0) {
        const noScoresMsg = document.createElement('p');
        noScoresMsg.classList.add('no-scores');
        noScoresMsg.textContent = 'No scores yet. Be the first!';
        container.appendChild(noScoresMsg);
        return;
    }
    scores.forEach(score => {
        const card = document.createElement('div');
        card.classList.add('score-card');
        const createScoreLine = (label, value) => {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = `${label}: `;
            const valueSpan = document.createElement('span');
            valueSpan.textContent = value;
            valueSpan.classList.add('score-value'); 
            p.appendChild(strong);
            p.appendChild(valueSpan);
            return p;
        };
        card.appendChild(createScoreLine('Name', score.playerName));
        card.appendChild(createScoreLine('Level', score.level));
        card.appendChild(createScoreLine('Time', score.time));
        card.appendChild(createScoreLine('Date', score.date || new Date().toLocaleDateString()));

        container.appendChild(card);
    });
};     
/**
 * Handles the filtering of high scores based on the selected difficulty level.
 * This function acts as a callback for the level selection buttons.
 * 
 * @param {Event} event - The click event object from the level button.
 * @returns {void}
 */
const handleLevelFilter = (event) => {
    const selectedLevel = event.currentTarget.dataset.level;
    const filteredScores = getFilteredScores(selectedLevel);
    const scoresContainer = document.querySelector('.scores-list');
    if (scoresContainer) {
        renderScoreCards(filteredScores, scoresContainer);
    }
};
/**
 * Initializes the high scores page by displaying the player's name 
 * and rendering the initial list of scores.
 */
const init = () => {
    const currentPlayerName = getCurrentPlayer(); 
    const welcomeElement = document.querySelector('.welcome-message span');
    if (welcomeElement) {
        welcomeElement.textContent = `HELLO ${currentPlayerName}`;
    }
    const scoresContainer = document.querySelector('.scores-list');
    if (scoresContainer) {
        const allScores = getAllScores();
        renderScoreCards(sortScoresByTime(allScores), scoresContainer);
    } 
};
document.addEventListener('DOMContentLoaded', init);