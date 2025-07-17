from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class ItemModel(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(30), unique=True, index=True, nullable=False)
    status = Column(Integer, nullable=False)
    comment = Column(String(100), nullable=True)
    category = Column(Integer, nullable=False)
    updated_on = Column(DateTime, nullable=False)


class CalendarEventModel(Base):
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    note = Column(String(200), nullable=False)
    color = Column(Integer, nullable=False)
    updated_on = Column(DateTime, nullable=False)
