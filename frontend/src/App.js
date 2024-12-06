import React, { useState, useEffect } from "react";
import NoteDisplay from "./Components/NoteDisplay";
import Controls from "./Components/Controls";
import PitchGraph from "./Components/PitchGraph";
import { startMicrophone, stopMicrophone, detectPitchFromAudio } from "./utils/audio";
// import FingeringChart from "./Components/fingering/FingeringChart";
// import {Fingering, STANDARD_FINGERINGS_BY_NOTE} from "./Components/fingering/Fingering";
import InteractiveFingeringChart from './Components/InteractiveFingeringChart';

// import pitchfinder from "pitchfinder"; // Uncomment when integrating pitch detection

function App() {
    const [sequences, setSequences] = useState([]);
    const [currentSequence, setCurrentSequence] = useState([]);
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    const [viewType, setViewType] = useState("Full");
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackInterval, setPlaybackInterval] = useState(null);
    const [precisionLevel, setPrecisionLevel] = useState(3);
    const [pitchData, setPitchData] = useState([]);
    const [accuracyData, setAccuracyData] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [ currentNote, setCurrentNote] = useState(null)
    // const [activeFingers, setActiveFingers] = useState(["left1", "left2", "right1"]);


    // Fetch scales (sequences) from the backend
    useEffect(() => {
        fetch("http://localhost:8000/get_scales")
            .then((response) => response.json())
            .then((data) => setSequences(data))
            .catch((error) => console.error("Error fetching scales:", error));

    }, []);

    // Listen to microphone input if active
    useEffect(() => {
        let interval;

        if (isListening) {
            interval = setInterval(() => {
                const pitch = detectPitchFromAudio();
                if (pitch && pitch < 1700) {
                    console.log("Detected pitch (Hz):", pitch);
                    const detected_note = findClosestNote(pitch)
                    console.log("Detected note:", detected_note.name)
                    setCurrentNote(detected_note)

                    setPitchData((prev) => [...prev.slice(-49), pitch]); // Keep last 50 pitches
                    // analyzePitch(pitch);
                }
            }, 100); // Analyze every 100ms
        }

        return () => clearInterval(interval); // Clean up on stop
    }, [isListening]);

    const calculateRange = (basePitch) => {
        if (!basePitch) return { min: 0, max: 0 };
        const tolerance = [0.2, 0.1, 0.05, 0.02, 0.01][precisionLevel - 1];
        console.log({ min: basePitch * (1 - tolerance), max: basePitch * (1 + tolerance) })
        return { min: basePitch * (1 - tolerance), max: basePitch * (1 + tolerance) };
    };

    const isPitchCorrect = (detectedPitch, basePitch, level) => {
        const { min, max } = calculateRange(basePitch, level);
        return detectedPitch >= min && detectedPitch <= max;
    };

    const analyzePitch = (detectedPitch) => {
        const currentNote = currentSequence[currentNoteIndex];
        if (!currentNote) return;

        const isCorrect = isPitchCorrect(detectedPitch, currentNote.pitch, precisionLevel);

        setPitchData((prev) => [...prev.slice(-49), detectedPitch]);
        setAccuracyData((prev) => [
            ...prev,
            {
                expected_note: currentNote.name,
                detected_note: detectedPitch,
                timestamp: Date.now(),
                correctness: isCorrect,
                deviation: Math.abs(detectedPitch - currentNote.pitch),
                precision_level: precisionLevel,
            },
        ]);
    };

    // Function to find the closest note based on detected pitch
    const findClosestNote = (pitch) => {
        if (!pitch) return null;

        return currentSequence.reduce((closest, note) => {
            const notePitch = parseFloat(note.expected_pitch);
            return Math.abs(notePitch - pitch) < Math.abs(closest.expected_pitch - pitch)
                ? note
                : closest;
        });
    };

    const saveAccuracyData = () => {
        fetch("http://localhost:8000/store_accuracy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(accuracyData),
        })
            .then((response) => response.json())
            .then((data) => console.log("Accuracy data saved:", data))
            .catch((error) => console.error("Error saving accuracy data:", error));
    };

    const startPlayback = () => {
        if (currentSequence.length === 0 || isPlaying) return;

        setIsPlaying(true);
        const noteLength = currentSequence[currentNoteIndex]?.length * 1000 || 1000;

        const interval = setInterval(() => {
            setCurrentNoteIndex((prevIndex) => (prevIndex + 1) % currentSequence.length);
        }, noteLength);

        setPlaybackInterval(interval);
    };

    const stopPlayback = () => {
        if (playbackInterval) {
            clearInterval(playbackInterval);
            setPlaybackInterval(null);
        }
        setIsPlaying(false);
        saveAccuracyData();
    };


    // Toggle microphone listening
    const toggleListening = () => {
        if (isListening) {
            stopMicrophone();
            setIsListening(false);
        } else {
            startMicrophone();
            setIsListening(true);
        }
    };


    return (
        <div style={{padding: "20px", fontFamily: "Arial, sans-serif"}}>
            <h1>Saxophone Practice App</h1>
            <Controls
                sequences={Object.keys(sequences)}
                onSequenceChange={(name) => setCurrentSequence(sequences[name] || [])}
                onStart={startPlayback}
                onStop={stopPlayback}
                onViewTypeChange={setViewType}
                onPrevious={() => setCurrentNoteIndex((i) => (i === 0 ? currentSequence.length - 1 : i - 1))}
                onNext={() => setCurrentNoteIndex((i) => (i + 1) % currentSequence.length)}
                precisionLevel={precisionLevel}
                onPrecisionChange={setPrecisionLevel}
            />
            <div>
            <button onClick={toggleListening}>
                {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            {/*<div>*/}
            {/*    <h2>Detected Pitches:</h2>*/}
            {/*    <ul>*/}
            {/*        {pitchData.map((pitch, index) => (*/}
            {/*            <li key={index}>{pitch.toFixed(2)} Hz</li>*/}
            {/*        ))}*/}
            {/*    </ul>*/}
            {/*</div>*/}

            </div>
            <tr>
                <td>
                    <NoteDisplay note={currentSequence[currentNoteIndex]} label={"Expected note"} viewType={viewType} initialMessage={"Please select a sequence to start."} activeFingers={["left1", "left2", "right1"]}/>
                </td>
                <td width={100 }>

                </td>
                <td>
                    <NoteDisplay note={currentNote} label={"Detected note"} viewType={viewType}
                                 initialMessage={"Start notes detection and start playing to see the detected note"}/>
                </td>
            </tr>

            {/*<InteractiveFingeringChart />*/}


            {pitchData.length > 0 && (
                <PitchGraph
                    pitchData={pitchData}
                    expectedRange={calculateRange(currentSequence[currentNoteIndex]?.expected_pitch)}
                />
            )}
        </div>
    );
}


export default App;
