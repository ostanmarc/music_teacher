import React from "react";

function Controls({
                      sequences,
                      onSequenceChange,
                      onStart,
                      onStop,
                      onViewTypeChange,
                      onPrevious,
                      onNext,
                      precisionLevel,
                      onPrecisionChange,
                  }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            {/* Sequence Dropdown */}
            <label htmlFor="sequence-select" style={{ marginRight: "10px" }}>
                Select Sequence:
            </label>
            <select
                id="sequence-select"
                onChange={(e) => onSequenceChange(e.target.value)}
                style={{ marginRight: "20px" }}
            >
                <option value="">-- Select a Sequence --</option>
                {sequences.map((sequence, index) => (
                    <option key={index} value={sequence}>
                        {sequence}
                    </option>
                ))}
            </select>

            {/* Start/Stop Buttons */}
            <button onClick={onStart} style={{ marginRight: "10px" }}>
                Start
            </button>
            <button onClick={onStop} style={{ marginRight: "20px" }}>
                Stop
            </button>

            {/* View Type Dropdown */}
            <label htmlFor="view-select" style={{ marginRight: "10px" }}>
                View:
            </label>
            <select
                id="view-select"
                onChange={(e) => onViewTypeChange(e.target.value)}
                style={{ marginRight: "20px" }}
            >
                <option value="Full">Full</option>
                <option value="Note">Note</option>
            </select>

            {/* Previous and Next Buttons */}
            <button onClick={onPrevious} style={{ marginRight: "10px" }}>
                Previous
            </button>
            <button onClick={onNext} style={{ marginRight: "20px" }}>
                Next
            </button>

            {/* Precision Slider */}
            <label htmlFor="precision-slider" style={{ marginRight: "10px" }}>
                Precision Level:
            </label>
            <input
                type="range"
                id="precision-slider"
                min="1"
                max="5"
                value={precisionLevel}
                onChange={(e) => onPrecisionChange(parseInt(e.target.value))}
                style={{ marginRight: "10px" }}
            />
            <span>{precisionLevel}</span>
        </div>
    );
}

export default Controls;
