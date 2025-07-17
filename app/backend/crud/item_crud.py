from zoneinfo import ZoneInfo
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timedelta

from sql.models import ItemModel
from schemas.item import Item


def get_items(db: Session):
    return db.query(ItemModel).all()


def get_item(db: Session, item_id: int):
    if item_id < 1:
        raise HTTPException(status_code=400, detail="Invalid ID")

    item = db.query(ItemModel).filter(ItemModel.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
    return item


def update_item(db: Session, item_id: int, item_data: Item):
    if item_id < 1:
        raise HTTPException(status_code=400, detail="Invalid ID")

    if item_id != item_data.id:
        raise HTTPException(status_code=400, detail="Mismatched item IDs")

    existing_item = db.query(ItemModel).filter(ItemModel.id == item_id).first()
    if not existing_item:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")

    name_exists = (
        db.query(ItemModel)
        .filter(ItemModel.name == item_data.name, ItemModel.id != item_id)
        .first()
    )
    if name_exists:
        raise HTTPException(
            status_code=409, detail=f"Item with name '{item_data.name}' already exists"
        )

    # Update fields
    for attr, value in item_data.model_dump(exclude_unset=True).items():
        setattr(existing_item, attr, value)
    existing_item.updated_on = datetime.now(ZoneInfo("Europe/Helsinki"))

    db.commit()
    db.refresh(existing_item)
    return existing_item


def add_item(db: Session, item_data: Item):
    name_exists = db.query(ItemModel).filter(ItemModel.name == item_data.name).first()
    if name_exists:
        raise HTTPException(
            status_code=409, detail=f"Item with name '{item_data.name}' already exists"
        )

    now = datetime.now(ZoneInfo("Europe/Helsinki"))
    new_item = ItemModel(**item_data.model_dump(exclude_unset=True), updated_on=now)

    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


def delete_item(db: Session, item_id: int):
    if item_id < 1:
        raise HTTPException(status_code=400, detail="Invalid ID")

    item = db.query(ItemModel).filter(ItemModel.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")

    db.delete(item)
    db.commit()
    return True
