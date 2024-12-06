import React, {useState} from "react";
import { generateNoteSVG } from "../utils/noteGenerator";
import FingeringChart from "./fingering/FingeringChart";
import FingeringChartWrapper from "./FingeringChartWrapper";



function CustomFingeringComponent() {
    return <div style={{ border: "1px solid gray", padding: "10px" }}>Custom Fingering Diagram</div>;
}

function NoteDisplay({ note, viewType, label, FingeringComponent, initialMessage, activeFingers }) {
    if (!note) return <div>{initialMessage}</div>;


    const svg = generateNoteSVG(note.name, note.length || "q");


    return (


        <div style={{border: "1px solid black", padding: "20px", width: "300px"}}>
            {/* Configurable Label */}
            {label && <h3 style={{textAlign: "center", marginBottom: "10px"}}>{label}</h3>}
            {/* Note SVG */}

            <tr>
                <td>
                    <div dangerouslySetInnerHTML={{__html: svg}}/>
                </td>
                <td>
                    <div></div>
                    {/*<styledFingeringChartWrapper note={note.name}  />*/}

                    <FingeringChartWrapper note={note.name}  />
                </td>
            </tr>
            {/*<img*/}
            {/*    src={`${backendBaseUrl}/images/${encodeURIComponent(note.file_name)}`}*/}
            {/*    alt={note.name}*/}
            {/*    style={{width: "300px", height: "auto"}}*/}
            {/*/>*/}
            {/* Note Name */}
            <h2>{note.name}</h2>
            {/* Fingering Diagram (only in "Full" view) */}
            {viewType === "Full" && (
                <p>
                    Fingering: <code>{note.fingering_code}</code>
                </p>
            )}

            {/*/!* Fingering Diagram or Subcomponent *!/*/}
            {/*{viewType === "Full" && (*/}
            {/*    <div>*/}
            {/*        <p>*/}
            {/*            Fingering: <code>{note.fingering_code}</code>*/}
            {/*        </p>*/}
            {/*        /!* Render the subcomponent if provided *!/*/}
            {/*        {FingeringComponent && (*/}
            {/*            <div style={{marginTop: "10px"}}>*/}
            {/*                <FingeringComponent/>*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*)}*/}
            {/*<div style={{padding: "20px"}}>*/}
            {/*    <h1>Saxophone Fingering Chart</h1>*/}
            {/*    <SaxFingeringChart activeFingers={activeFingers}/>*/}
            {/*    /!*<button onClick={() => setActiveFingers(["left1", "right2", "thumb"])}>*!/*/}
            {/*    /!*    Change Active Fingers*!/*/}
            {/*    /!*</button>*!/*/}
            {/*</div>*/}

            {/*<div style={{width: '200px', height: '200px'}}>*/}
            {/*    <FingeringChartWrapper note={note.name} />*/}
            {/*</div>*/}
        </div>
    );
}

export default NoteDisplay;