import Vex from "vexflow";

function generateNoteSVG(note, length) {
    const VF = Vex.Flow;

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
        keys: [note], // e.g., "c/4", "b/3"
        duration: length, // e.g., "q" for quarter note, "h" for half note
    });

    // Add accidentals if needed
    if (note.includes("#")) staveNote.addAccidental(0, new VF.Accidental("#"));
    if (note.includes("b")) staveNote.addAccidental(0, new VF.Accidental("b"));

    // Render the note
    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables([staveNote]);
    const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 150);
    voice.draw(context, stave);

    return div.innerHTML; // Return the SVG as a string
}
