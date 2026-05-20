import{getAllScores, sortScoresByTime, getFilteredScores } from './storage.js'
import { formatTime,DIFFICULTY_ORDER } from './gLogic.js';
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
        card.appendChild(createScoreLine('Name', score.name));
        card.appendChild(createScoreLine('Level', (score.level || "").toUpperCase()));
        card.appendChild(createScoreLine('Time', formatTime(score.time)));
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
 * Dynamically creates and renders level filter buttons based on the available game difficulties.
 * Each button is assigned a data attribute for its respective level and an event listener 
 * to handle filtering logic when clicked.
 * * @param {HTMLElement} container - The DOM element where the filter buttons will be appended.
 * @returns {void}
 */
const renderLevelFilters = (container) => {
    DIFFICULTY_ORDER.forEach(level => {
        const button = document.createElement('button');
        button.textContent = level.charAt(0).toUpperCase() + level.slice(1); 
        button.dataset.level = level;
        button.classList.add('filter-btn');
        button.addEventListener('click', handleLevelFilter);
        container.appendChild(button);
    });
};
/**
 * Initializes the high scores page by rendering the initial list of scores.
 */
const init = () => {
    const filterContainer = document.querySelector('.filters-wrapper');
    if (filterContainer) {
        while (filterContainer.firstChild) {
        filterContainer.removeChild(filterContainer.firstChild);
        }
        renderLevelFilters(filterContainer);
        // const scoresContainer = filterContainer.nextElementSibling;
        const scoresContainer = document.querySelector('.scores-list');
        if (scoresContainer) {
            const allScores = getAllScores();
            renderScoreCards(sortScoresByTime(allScores), scoresContainer);
        }
    }
};
document.addEventListener('DOMContentLoaded', init);