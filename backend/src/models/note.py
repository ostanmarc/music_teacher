# Enum for note lengths
from enum import Enum
from pydantic import BaseModel

class NoteLength(str, Enum):
    WHOLE = "1"
    HALF = "1/2"
    QUARTER = "1/4"
    EIGHTH = "1/8"
    SIXTEENTH = "1/16"

# Note class
class Note:
    def __init__(self, name: str, file_name: str, fingering_code: str, length: NoteLength, expected_pitch: float = 350):
        self.name = name
        self.file_name = file_name
        self.fingering_code = fingering_code
        self.length = length
        self.expected_pitch = expected_pitch

class AccuracyEntry(BaseModel):
    expected_note: str
    detected_note: str
    timestamp: str
    correctness: bool
    deviation: float
    precision_level: int