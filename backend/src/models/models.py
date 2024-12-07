from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.services.database import Base

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    frequency = Column(Integer)

class Scale(Base):
    __tablename__ = "scales"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    notes = Column(String)  # This can store a comma-separated string or a JSON blob.
