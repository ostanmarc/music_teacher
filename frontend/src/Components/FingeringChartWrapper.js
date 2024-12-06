import React, {useEffect, useRef} from "react";
import FingeringChart from "./fingering/FingeringChart";
import {Fingering, STANDARD_FINGERINGS_BY_NOTE} from "./fingering/Fingering";
import {adjustOctave, prettyAccidental} from "./fingering/Util";




const FingeringChartWrapper = ({ note }) => {
    const containerRef = useRef(null);
    const shadowContainer = useRef(null);

    useEffect(() => {
        if (!note || !containerRef.current) return;

        // Function to initialize and render the FingeringChart inside Shadow DOM
        const initializeShadowDom = async () => {
            // Create the shadow root (or reuse it if already created)
            if (!shadowContainer.current) {
                shadowContainer.current = containerRef.current.attachShadow({ mode: "open" });
            }

            const shadowRoot = shadowContainer.current;

            // Add styles dynamically
            const style = document.createElement("style");
            style.textContent = `
               .container {
                    width: 100%;
                    max-width: 500px; /* Or any suitable size */
                    height: auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                body {
                    margin-left: 10px;
                    margin-right: 10px;
                    padding: 0;
                    font-family: sans-serif;
                }
                
                /* SVG styling */
                
                svg path {
                    fill: white;
                    stroke: black;
                    stroke-width: 3;
                }
                svg:not(.readonly) path {
                    cursor: pointer;
                }
                
                svg path.closed {
                    fill: black
                }
                
                svg:not(.readonly) path:hover:not(.closed) {
                    fill: lightgray
                }
                
                .diff-added {
                    stroke: lime;
                    stroke-width: 5;
                }
                
                .diff-removed {
                    stroke: red;
                    stroke-width: 5;
                }
                
                svg.hover-background {
                    cursor: pointer;
                }
                svg.hover-background:hover {
                    background-color: aliceblue;
                }
                
                /* Octave rollers*/
                
                g#octave.hide-rollers path {
                    fill: transparent;
                    stroke: transparent;
                }
                
                svg:not(.readonly) g#octave.hide-rollers:hover path {
                    stroke: darkgray;
                }
                
                svg:not(.readonly) g#octave.hide-rollers:hover path.closed {
                    fill: black;
                }
                
                /**/
                
                .selection-dot {
                    font-size: 2em;
                    line-height: 12px;
                }
                .note-selector:hover .selection-dot {
                    visibility: visible !important;
                }

            `;

            // Clean existing content before re-rendering
            shadowRoot.innerHTML = "";

            // Add the style element
            shadowRoot.appendChild(style);

            // Create a container for the FingeringChart
            const container = document.createElement("div");
            shadowRoot.appendChild(container);

            // Fetch props for the given note and render
            const fingeringProps = generateFingeringProps(note);
            if (!fingeringProps) {
                container.innerHTML = "<div>No fingering data available</div>";
                return;
            }

            // Dynamically import ReactDOM to render the FingeringChart
            const { createRoot } = await import("react-dom/client");
            createRoot(container).render(<FingeringChart {...fingeringProps} />);
        };

        initializeShadowDom();

        // Clean up function to unmount the component on re-render or unmount
        return () => {
            if (shadowContainer.current) {
                shadowContainer.current.innerHTML = ""; // Clear the Shadow DOM content
            }
        };
    }, [note]);

    return <div ref={containerRef} />;
};


function generateFingeringProps(noteName) {
    const bitmask = STANDARD_FINGERINGS_BY_NOTE[noteName];
    console.log(`BITMASK: ${(bitmask >>> 0).toString(2)}`)
    if (!bitmask) {
        console.error(`No bitmask available for note: ${noteName}`);
        return null;
    }

    const fingering = new Fingering(bitmask);

    // Calculate adjusted note name with octave and accidental
    const adjustedNote = prettyAccidental(adjustOctave(noteName, fingering.roller));

    return {
        fingering,
        roller: fingering.roller,
        rollerDiff: fingering.rollerDiff || 0,
        note: adjustedNote,
    };
}

export default FingeringChartWrapper;
