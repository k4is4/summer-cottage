import os
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
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


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )


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
app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")


# Catch-all route to serve the React index.html file. This allows React Router to handle all the frontend routing.
@app.get("/{full_path:path}", response_class=FileResponse)
async def serve_react_app(full_path: str):
    index_path = os.path.join("dist", "index.html")
    if not os.path.exists(index_path):
        raise HTTPException(status_code=404, detail="Frontend entry point not found")
    return FileResponse(index_path)
