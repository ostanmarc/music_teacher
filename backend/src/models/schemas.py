from pydantic import BaseModel

class NoteBase(BaseModel):
    name: str
    frequency: int

class NoteCreate(NoteBase):
    pass

class NoteResponse(NoteBase):
    id: int

    class Config:
        orm_mode = True


class ScaleBase(BaseModel):
    name: str
    description: str
    notes: str  # Can be expanded for complex data.

class ScaleCreate(ScaleBase):
    pass

class ScaleResponse(ScaleBase):
    id: int

    class Config:
        orm_mode = True
