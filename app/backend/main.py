import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List

from crud import calendar_event_crud, item_crud
from schemas.item import Item
from schemas.calendar_event import CalendarEvent
from sql.database import SessionLocal, engine  # Make sure to define DB connection here
from sql.models import Base


Base.metadata.create_all(bind=engine)

app = FastAPI()


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Item routes
@app.get("/api/items", response_model=List[Item])
def list_items(db: Session = Depends(get_db)):
    print("moi")
    return item_crud.get_items(db)


@app.get("/api/items/{item_id}", response_model=Item)
def read_item(item_id: int, db: Session = Depends(get_db)):
    return item_crud.get_item(db, item_id)


@app.post("/api/items", response_model=Item)
def create_item(item: Item, db: Session = Depends(get_db)):
    return item_crud.add_item(db, item)


@app.put("/api/items/{item_id}", response_model=Item)
def update_item(item_id: int, item: Item, db: Session = Depends(get_db)):
    return item_crud.update_item(db, item_id, item)


@app.delete("/api/items/{item_id}")
def remove_item(item_id: int, db: Session = Depends(get_db)):
    item_crud.delete_item(db, item_id)
    return {"detail": "Item deleted"}


# Calendar routes
@app.get("/api/calendar-events", response_model=List[CalendarEvent])
def list_calendar_events(db: Session = Depends(get_db)):
    return calendar_event_crud.get_calendar_events(db)


@app.get("/api/calendar-events/{event_id}", response_model=CalendarEvent)
def get_calendar_event(event_id: int, db: Session = Depends(get_db)):
    return calendar_event_crud.get_calendar_event(db, event_id)


@app.post("/api/calendar-events", response_model=CalendarEvent)
def create_calendar_event(event: CalendarEvent, db: Session = Depends(get_db)):
    return calendar_event_crud.add_calendar_event(db, event)


@app.put("/api/calendar-events/{event_id}", response_model=CalendarEvent)
def update_calendar_event(
    event_id: int, event: CalendarEvent, db: Session = Depends(get_db)
):
    return calendar_event_crud.update_calendar_event(db, event_id, event)


@app.delete("/api/calendar-events/{event_id}")
def delete_calendar_event(event_id: int, db: Session = Depends(get_db)):
    calendar_event_crud.delete_calendar_event(db, event_id)
    return {"detail": "Calendar event deleted"}


# Mount the static files
app.mount("/", StaticFiles(directory="dist", html=True), name="frontend")


# Create a root route to serve index.html
@app.get("/")
async def root():
    return FileResponse(os.path.join("dist", "index.html"))
