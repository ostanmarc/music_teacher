import React, { useState } from "react";
import FingeringChart from "./fingering/FingeringChart";
import { Fingering } from "./fingering/Fingering";
import { prettyAccidental, adjustOctave } from "./fingering/Util";

const InteractiveFingeringChartWrapper = () => {
    const [fingering, setFingering] = useState(new Fingering(0));
    const [bitmask, setBitmask] = useState("0");

    const handleKeyToggle = (keyIndex) => {
        const updatedFingering = new Fingering(fingering.bitmask);
        const key = updatedFingering.keys[keyIndex];
        if (key.pressed) {
            key.unpress();
        } else {
            key.press();
        }
        setFingering(updatedFingering);
        setBitmask(updatedFingering.bitmaskString);
    };

    const handleRollerChange = (rollerValue) => {
        const updatedFingering = new Fingering(fingering.bitmask, rollerValue);
        setFingering(updatedFingering);
        setBitmask(updatedFingering.bitmaskString);
    };

    const fingeringProps = {
        fingering,
        roller: fingering.roller,
        rollerDiff: fingering.rollerDiff || 0,
        note: prettyAccidental(adjustOctave(fingering.note, fingering.roller)),
        handleKeyClick: (keyId) => handleKeyToggle(fingering.keys.findIndex((k) => k.index === parseInt(keyId))),
        handleRollerClick: handleRollerChange,
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h3>Interactive Fingering Chart</h3>
            <FingeringChart {...fingeringProps} />
            <div style={{ marginTop: "20px" }}>
                <strong>Current Bitmask:</strong> <code>{bitmask}</code>
            </div>
        </div>
    );
};

export default InteractiveFingeringChartWrapper;
