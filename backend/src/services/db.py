from typing import List
from ..models.note import Note, NoteLength


def get_notes_by_names(names: List[str]) -> List[dict]:
    notes_map = {note.name: note for note in notes_data}
    return [notes_map[name].__dict__ for name in names if name in notes_map]


# notes_data = [
#     Note("G", "G.svg", "G_fingering_code", NoteLength.QUARTER),
#     Note("A", "A.svg", "A_fingering_code", NoteLength.QUARTER),
#     Note("B", "B.svg", "B_fingering_code", NoteLength.QUARTER),
#     Note("C", "C.svg", "C_fingering_code", NoteLength.QUARTER),
#     Note("D", "D.svg", "D_fingering_code", NoteLength.QUARTER),
#     Note("E", "E.svg", "E_fingering_code", NoteLength.QUARTER),
#     Note("F#", "Fsharp.svg", "Fsharp_fingering_code", NoteLength.QUARTER),
#     Note("F", "F.svg", "F_fingering_code", NoteLength.QUARTER),
#     Note("Bb", "Bb.svg", "Bb_fingering_code", NoteLength.QUARTER),
#     Note("C#", "Csharp.svg", "Csharp_fingering_code", NoteLength.QUARTER)
# ]

# Notes data
# notes_data_backup = [
#     {"note": "Bb3", "image": "Bb3.svg", "fingering": "XOO|XXX"},
#     {"note": "B3", "image": "B3.svg", "fingering": "XXO|XXX"},
#     {"note": "C4", "image": "C4.svg", "fingering": "XXX|XXO"},
#     {"note": "C#4", "image": "C#4.svg", "fingering": "XXX|XOX"},
#     {"note": "D4", "image": "D4.svg", "fingering": "XXO|XXO"},
#     {"note": "Eb4", "image": "Eb4.svg", "fingering": "XXO|XOX"},
#     {"note": "E4", "image": "E4.svg", "fingering": "XOO|XXO"},
#     {"note": "F4", "image": "F4.svg", "fingering": "XOO|XOX"},
#     {"note": "F#4", "image": "F#4.svg", "fingering": "XOO|OOO"},
#     {"note": "G4", "image": "G4.svg", "fingering": "XOX|XXX"},
#     {"note": "Ab4", "image": "Ab4.svg", "fingering": "XOX|XOX"},
#     {"note": "A4", "image": "A4.svg", "fingering": "OOO|XXX"},
#     {"note": "Bb4", "image": "Bb4.svg", "fingering": "OOO|XOX"},
#     {"note": "B4", "image": "B4.svg", "fingering": "OXO|XXX"},
#     {"note": "C5", "image": "C5.svg", "fingering": "OXO|XOX"},
#     {"note": "C#5", "image": "C#5.svg", "fingering": "OXO|OOO"},
#     {"note": "D5", "image": "D5.svg", "fingering": "XOO|OXO"},
#     {"note": "Eb5", "image": "Eb5.svg", "fingering": "XXO|OXO"},
#     {"note": "E5", "image": "E5.svg", "fingering": "XXX|OXO"},
#     {"note": "F5", "image": "F5.svg", "fingering": "XXO|XOO"},
#     {"note": "F#5", "image": "F#5.svg", "fingering": "XXO|OXO"},
#     {"note": "G5", "image": "G5.svg", "fingering": "OXO|XOO"},
#     {"note": "Ab5", "image": "Ab5.svg", "fingering": "OXO|OXO"},
#     {"note": "A5", "image": "A5.svg", "fingering": "OOO|XOO"},
#     {"note": "Bb5", "image": "Bb5.svg", "fingering": "OXO|XOX"},
#     {"note": "B5", "image": "B5.svg", "fingering": "OXO|OOO"},
#     {"note": "C6", "image": "C6.svg", "fingering": "XXX|XOX"},
#     {"note": "C#6", "image": "C#6.svg", "fingering": "XXO|OOO"},
#     {"note": "D6", "image": "D6.svg", "fingering": "XOX|OXO"},
#     {"note": "Eb6", "image": "Eb6.svg", "fingering": "OOO|OXO"},
#     {"note": "E6", "image": "E6.svg", "fingering": "XOO|XXX"},
#     {"note": "F6", "image": "F6.svg", "fingering": "XOO|XOX"},
#     {"note": "F#6", "image": "F#6.svg", "fingering": "XXX|OOO"},
#     {"note": "G6", "image": "G6.svg", "fingering": "OXO|XXX"},
#     {"note": "Ab6", "image": "Ab6.svg", "fingering": "OXO|XOX"},
#     {"note": "A6", "image": "A6.svg", "fingering": "OOO|XXX"}
# ]

# Convert the provided note data list into objects of the `Note` class with default length "1"
notes_data = [
    Note(name=data["note"], file_name=data["image"], fingering_code=data["fingering"], length=NoteLength.WHOLE,
         expected_pitch=int(data.get("expected_pitch")))
    for data in [
        {"note": "Bb3", "image": "Bb3.svg", "fingering": "XOO|XXX", "expected_pitch": 138.59},
        {"note": "B3", "image": "B3.svg", "fingering": "XXO|XXX", "expected_pitch": 146.83},
        {"note": "C4", "image": "C4.svg", "fingering": "XXX|XXO", "expected_pitch": 155.56},
        {"note": "C#4", "image": "C#4.svg", "fingering": "XXX|XOX", "expected_pitch": 164.81},
        {"note": "D4", "image": "D4.svg", "fingering": "XXO|XXO", "expected_pitch": 174.61},
        {"note": "Eb4", "image": "Eb4.svg", "fingering": "XXO|XOX", "expected_pitch": 185.0},
        {"note": "E4", "image": "E4.svg", "fingering": "XOO|XXO", "expected_pitch": 196.0},
        {"note": "F4", "image": "F4.svg", "fingering": "XOO|XOX", "expected_pitch": 207.65},
        {"note": "F#4", "image": "F#4.svg", "fingering": "XOO|OOO", "expected_pitch": 220.0},
        {"note": "G4", "image": "G4.svg", "fingering": "XOX|XXX", "expected_pitch": 233.08},
        {"note": "Ab4", "image": "Ab4.svg", "fingering": "XOX|XOX", "expected_pitch": 246.94},
        {"note": "A4", "image": "A4.svg", "fingering": "OOO|XXX", "expected_pitch": 261.63},
        {"note": "Bb4", "image": "Bb4.svg", "fingering": "OOO|XOX", "expected_pitch": 277.18},
        {"note": "B4", "image": "B4.svg", "fingering": "OXO|XXX", "expected_pitch": 293.66},
        {"note": "C5", "image": "C5.svg", "fingering": "OXO|XOX", "expected_pitch": 311.13},
        {"note": "C#5", "image": "C#5.svg", "fingering": "OXO|OOO", "expected_pitch": 329.63},
        {"note": "D5", "image": "D5.svg", "fingering": "XOO|OXO", "expected_pitch": 349.23},
        {"note": "Eb5", "image": "Eb5.svg", "fingering": "XXO|OXO", "expected_pitch": 369.99},
        {"note": "E5", "image": "E5.svg", "fingering": "XXX|OXO", "expected_pitch": 392.0},
        {"note": "F5", "image": "F5.svg", "fingering": "XXO|XOO", "expected_pitch": 415.3},
        {"note": "F#5", "image": "F#5.svg", "fingering": "XXO|OXO", "expected_pitch": 440.0},
        {"note": "G5", "image": "G5.svg", "fingering": "OXO|XOO", "expected_pitch": 466.16},
        {"note": "Ab5", "image": "Ab5.svg", "fingering": "OXO|OXO", "expected_pitch": 493.88},
        {"note": "A5", "image": "A5.svg", "fingering": "OOO|XOO", "expected_pitch": 523.25},
        {"note": "Bb5", "image": "Bb5.svg", "fingering": "OXO|XOX", "expected_pitch": 554.37},
        {"note": "B5", "image": "B5.svg", "fingering": "OXO|OOO", "expected_pitch": 587.33},
        {"note": "C6", "image": "C6.svg", "fingering": "XXX|XOX", "expected_pitch": 622.25},
        {"note": "C#6", "image": "C#6.svg", "fingering": "XXO|OOO", "expected_pitch": 659.26},
        {"note": "D6", "image": "D6.svg", "fingering": "XOX|OXO", "expected_pitch": 698.46},
        {"note": "Eb6", "image": "Eb6.svg", "fingering": "OOO|OXO", "expected_pitch": 739.99},
        {"note": "E6", "image": "E6.svg", "fingering": "XOO|XXX", "expected_pitch": 783.99},
        {"note": "F6", "image": "F6.svg", "fingering": "XOO|XOX", "expected_pitch": 830.61},
        {"note": "F#6", "image": "F#6.svg", "fingering": "XXX|OOO", "expected_pitch": 880.0},
        {"note": "G6", "image": "G6.svg", "fingering": "OXO|XXX", "expected_pitch": 932.33},
        {"note": "Ab6", "image": "Ab6.svg", "fingering": "OXO|XOX", "expected_pitch": 987.77},
        {"note": "A6", "image": "A6.svg", "fingering": "OOO|XXX", "expected_pitch": 1046.5}
    ]


]

# Predefined scales
scales = {
    "G Major": ["G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5"],
    "F Major": ["F4", "G4", "A4", "Bb4", "C5", "D5", "E5", "F5"],
    # "D Major": ["D", "E", "F#", "G", "A", "B", "C#", "D"],
    "All": [note.name for note in notes_data]
}

accuracy_data = []
