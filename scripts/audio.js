const winSound = new Audio('../audio/win.mp3');
const loseSound = new Audio('../audio/explotion.wav');

/**
 * Safely plays an audio object from the beginning.
 * Uses an asynchronous approach to handle the Playback Promise and 
 * catches potential errors (e.g., browser autoplay restrictions).
 * * @param {HTMLAudioElement} sound - The audio object to be played.
 * @returns {Promise<void>} A promise that resolves when playback starts.
 */
const playSoundSafely = async (sound) => {
    try {
        sound.currentTime = 0;
        await sound.play();
    } catch (err) {
        console.error("Audio playback interrupted or blocked:", err);
    }
};
/**
 * A simple wrapper that calls playSoundSafely to play the victory sound.
 * @returns {void}
 */
export const playWinSound = () => playSoundSafely(winSound);
/**
 * Plays the loss sound effect twice in a row.
 * Uses the 'onended' event listener to trigger the second playback 
 * immediately after the first one finishes, creating a double-impact effect.
 * * @returns {void}
 */
export const playLoseSequence = () => {
    playSoundSafely(loseSound);
    loseSound.onended = () => {
        playSoundSafely(loseSound);
        loseSound.onended = null; 
    };
};
