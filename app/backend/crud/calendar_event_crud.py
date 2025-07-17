from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timedelta

from sql.models import CalendarEventModel
from schemas.calendar_event import CalendarEvent


def get_calendar_events(db: Session):
    return db.query(CalendarEventModel).all()


def get_calendar_event(db: Session, event_id: int):
    if event_id < 1:
        raise HTTPException(status_code=400, detail="Invalid ID")

    event = (
        db.query(CalendarEventModel).filter(CalendarEventModel.id == event_id).first()
    )
    if not event:
        raise HTTPException(
            status_code=404, detail=f"Calendar event {event_id} not found"
        )

    return event


def add_calendar_event(db: Session, event_data: CalendarEvent):
    new_event = CalendarEventModel(**event_data.dict())
    new_event.updated_on = datetime.utcnow() + timedelta(hours=3)

    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event


def update_calendar_event(db: Session, event_id: int, event_data: CalendarEvent):
    if event_id < 1:
        raise HTTPException(status_code=400, detail="Invalid ID")

    if event_id != event_data.id:
        raise HTTPException(status_code=400, detail="Mismatched event IDs")

    event = (
        db.query(CalendarEventModel).filter(CalendarEventModel.id == event_id).first()
    )
    if not event:
        raise HTTPException(
            status_code=404, detail=f"Calendar event {event_id} not found"
        )

    for attr, value in event_data.dict().items():
        setattr(event, attr, value)
    event.updated_on = datetime.utcnow() + timedelta(hours=3)

    db.commit()
    db.refresh(event)
    return event


def delete_calendar_event(db: Session, event_id: int):
    if event_id < 1:
        raise HTTPException(status_code=400, detail="Invalid ID")

    event = (
        db.query(CalendarEventModel).filter(CalendarEventModel.id == event_id).first()
    )
    if not event:
        raise HTTPException(
            status_code=404, detail=f"Calendar event {event_id} not found"
        )

    db.delete(event)
    db.commit()
    return True
