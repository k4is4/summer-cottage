import json
import logging
from datetime import datetime

import azure.functions as func
from pydantic import ValidationError

from crud import calendar_event_crud, item_crud
from schemas.calendar_event import CalendarEvent
from schemas.item import Item
from shared.exceptions import HTTPException
from sql.database import get_db

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


def _json_default(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")


def _ok(data, status_code: int = 200) -> func.HttpResponse:
    if isinstance(data, list):
        body = [
            d.model_dump(by_alias=True) if hasattr(d, "model_dump") else d
            for d in data
        ]
    elif hasattr(data, "model_dump"):
        body = data.model_dump(by_alias=True)
    else:
        body = data
    return func.HttpResponse(
        json.dumps(body, default=_json_default),
        status_code=status_code,
        mimetype="application/json",
    )


def _err(status_code: int, detail: str) -> func.HttpResponse:
    return func.HttpResponse(
        json.dumps({"detail": detail}),
        status_code=status_code,
        mimetype="application/json",
    )


def _parse_id(req: func.HttpRequest, param: str):
    raw = req.route_params.get(param)
    try:
        value = int(raw)
    except (TypeError, ValueError):
        return None, _err(400, f"Invalid {param}: '{raw}'")
    return value, None


# ── Items ─────────────────────────────────────────────────────────────────────


@app.route(route="items", methods=["GET"])
def list_items(req: func.HttpRequest) -> func.HttpResponse:
    db_gen = get_db()
    db = next(db_gen)
    try:
        rows = item_crud.get_items(db)
        return _ok([Item.model_validate(r) for r in rows])
    except HTTPException as e:
        return _err(e.status_code, e.detail)
    finally:
        db_gen.close()


@app.route(route="items/{item_id}", methods=["GET"])
def read_item(req: func.HttpRequest) -> func.HttpResponse:
    item_id, err = _parse_id(req, "item_id")
    if err:
        return err
    db_gen = get_db()
    db = next(db_gen)
    try:
        row = item_crud.get_item(db, item_id)
        return _ok(Item.model_validate(row))
    except HTTPException as e:
        return _err(e.status_code, e.detail)
    finally:
        db_gen.close()


@app.route(route="items", methods=["POST"])
def create_item(req: func.HttpRequest) -> func.HttpResponse:
    try:
        item = Item.model_validate(req.get_json())
    except (ValidationError, ValueError) as e:
        return _err(422, str(e))
    db_gen = get_db()
    db = next(db_gen)
    try:
        new_item = item_crud.add_item(db, item)
        return _ok(Item.model_validate(new_item), status_code=201)
    except HTTPException as e:
        return _err(e.status_code, e.detail)
    finally:
        db_gen.close()


@app.route(route="items/{item_id}", methods=["PUT"])
def update_item(req: func.HttpRequest) -> func.HttpResponse:
    item_id, err = _parse_id(req, "item_id")
    if err:
        return err
    try:
        item = Item.model_validate(req.get_json())
    except (ValidationError, ValueError) as e:
        return _err(422, str(e))
    db_gen = get_db()
    db = next(db_gen)
    try:
        updated = item_crud.update_item(db, item_id, item)
        return _ok(Item.model_validate(updated))
    except HTTPException as e:
        return _err(e.status_code, e.detail)
    finally:
        db_gen.close()


@app.route(route="items/{item_id}", methods=["DELETE"])
def delete_item(req: func.HttpRequest) -> func.HttpResponse:
    item_id, err = _parse_id(req, "item_id")
    if err:
        return err
    db_gen = get_db()
    db = next(db_gen)
    try:
        item_crud.delete_item(db, item_id)
        return _ok({"detail": "Item deleted"})
    except HTTPException as e:
        return _err(e.status_code, e.detail)
    finally:
        db_gen.close()


# ── Calendar Events ───────────────────────────────────────────────────────────


@app.route(route="calendar-events", methods=["GET"])
def list_calendar_events(req: func.HttpRequest) -> func.HttpResponse:
    db_gen = get_db()
    db = next(db_gen)
    try:
        rows = calendar_event_crud.get_calendar_events(db)
        return _ok([CalendarEvent.model_validate(r) for r in rows])
    except HTTPException as e:
        return _err(e.status_code, e.detail)
    finally:
        db_gen.close()


@app.route(route="calendar-events/{event_id}", methods=["GET"])
def get_calendar_event(req: func.HttpRequest) -> func.HttpResponse:
    event_id, err = _parse_id(req, "event_id")
    if err:
        return err
    db_gen = get_db()
    db = next(db_gen)
    try:
        row = calendar_event_crud.get_calendar_event(db, event_id)
        return _ok(CalendarEvent.model_validate(row))
    except HTTPException as e:
        return _err(e.status_code, e.detail)
    finally:
        db_gen.close()


@app.route(route="calendar-events", methods=["POST"])
def create_calendar_event(req: func.HttpRequest) -> func.HttpResponse:
    try:
        event = CalendarEvent.model_validate(req.get_json())
    except (ValidationError, ValueError) as e:
        return _err(422, str(e))
    db_gen = get_db()
    db = next(db_gen)
    try:
        new_event = calendar_event_crud.add_calendar_event(db, event)
        return _ok(CalendarEvent.model_validate(new_event), status_code=201)
    except HTTPException as e:
        return _err(e.status_code, e.detail)
    finally:
        db_gen.close()


@app.route(route="calendar-events/{event_id}", methods=["PUT"])
def update_calendar_event(req: func.HttpRequest) -> func.HttpResponse:
    event_id, err = _parse_id(req, "event_id")
    if err:
        return err
    try:
        event = CalendarEvent.model_validate(req.get_json())
    except (ValidationError, ValueError) as e:
        return _err(422, str(e))
    db_gen = get_db()
    db = next(db_gen)
    try:
        updated = calendar_event_crud.update_calendar_event(db, event_id, event)
        return _ok(CalendarEvent.model_validate(updated))
    except HTTPException as e:
        return _err(e.status_code, e.detail)
    finally:
        db_gen.close()


@app.route(route="calendar-events/{event_id}", methods=["DELETE"])
def delete_calendar_event(req: func.HttpRequest) -> func.HttpResponse:
    event_id, err = _parse_id(req, "event_id")
    if err:
        return err
    db_gen = get_db()
    db = next(db_gen)
    try:
        calendar_event_crud.delete_calendar_event(db, event_id)
        return _ok({"detail": "Calendar event deleted"})
    except HTTPException as e:
        return _err(e.status_code, e.detail)
    finally:
        db_gen.close()
