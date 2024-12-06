import PitchFinder from "pitchfinder";

let audioContext = null;
let analyserNode = null;
let microphoneStream = null;
let pitchFinder = null;

export const startMicrophone = async () => {
    if (audioContext) return; // Prevent multiple initializations

    try {
        // Initialize AudioContext
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048; // Size of the FFT window

        // Get microphone access
        microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Connect microphone stream to analyser
        const source = audioContext.createMediaStreamSource(microphoneStream);
        source.connect(analyserNode);

        // Initialize PitchFinder
        pitchFinder = new PitchFinder.YIN({ sampleRate: audioContext.sampleRate });

        console.log("Microphone initialized.");
    } catch (error) {
        console.error("Failed to initialize microphone:", error);
    }
};

export const stopMicrophone = () => {
    if (microphoneStream) {
        const tracks = microphoneStream.getTracks();
        tracks.forEach((track) => track.stop());
        microphoneStream = null;
    }

    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }

    console.log("Microphone stopped.");
};

export const detectPitchFromAudio = () => {
    if (!analyserNode || !pitchFinder) {
        console.warn("Microphone or pitch detection is not initialized.");
        return null;
    }

    // Get audio data from analyser
    const buffer = new Float32Array(analyserNode.fftSize);
    analyserNode.getFloatTimeDomainData(buffer);

    // Detect pitch
    const pitch = pitchFinder(buffer);
    return pitch || null; // Returns `null` if no pitch is detected
};
