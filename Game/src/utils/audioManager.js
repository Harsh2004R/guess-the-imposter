let unlocked = false;
let audio = null;

export const unlockAudio = async (soundFile) => {
    if (unlocked) return;

    try {
        audio = new Audio(soundFile);

        audio.volume = 0;

        await audio.play();

        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1;

        unlocked = true;

        console.log("Audio unlocked");
    } catch (err) {
        console.log("Audio unlock failed", err);
    }
};

export const playNotification = async () => {
    if (!unlocked || !audio) return;

    try {
        audio.currentTime = 0;
        await audio.play();
    } catch (err) {
        console.log(err);
    }
};

export const isAudioUnlocked = () => unlocked;