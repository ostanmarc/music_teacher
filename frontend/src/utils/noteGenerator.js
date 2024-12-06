import Vex from "vexflow";

function convertToVexFlowKey(note) {
    // Extract the pitch (e.g., Bb, C#, F) and octave (e.g., 3, 4)
    const match = note.match(/^([A-Ga-g][b#]?)(\d+)$/);
    if (!match) {
        throw new Error(`Invalid note format: ${note}`);
    }

    const [, pitch, octave] = match;

    // Convert pitch to lowercase and handle flats/sharps
    const formattedPitch = pitch.toLowerCase().replace("b", "b").replace("#", "#");

    return `${formattedPitch}/${octave}`;
}


function generateNoteSVG(note, length) {
    const VF = Vex.Flow;

    // Convert note to VexFlow format
    const vexflowKey = convertToVexFlowKey(note);

    // Create an SVG renderer and attach it to a DIV element
    const div = document.createElement("div");
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // Configure the rendering context
    renderer.resize(200, 200);
    const context = renderer.getContext();

    // Create a stave (music staff)
    const stave = new VF.Stave(10, 40, 180);
    stave.addClef("treble").setContext(context).draw();

    // Create a note
    const staveNote = new VF.StaveNote({
        clef: "treble",
        keys: [vexflowKey], // e.g., "bb/3"
        duration: length, // e.g., "q" for quarter note, "h" for half note
    });

    // Add accidentals as modifiers
    if (note.includes("#")) {
        staveNote.addModifier(new VF.Accidental("#"), 0); // Apply sharp to the first notehead
    }
    if (note.includes("b")) {
        staveNote.addModifier(new VF.Accidental("b"), 0); // Apply flat to the first notehead
    }

    // Render the note
    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables([staveNote]);
    const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 150);
    voice.draw(context, stave);

    return div.innerHTML; // Return the SVG as a string
}

export { generateNoteSVG };