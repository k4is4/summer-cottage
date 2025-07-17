from pydantic import BaseModel, Field
from typing import Annotated
from datetime import datetime


class CalendarEvent(BaseModel):
    id: int
    start_date: datetime
    end_date: datetime
    note: Annotated[
        str, Field(max_length=200, description="Note should be 200 characters or less.")
    ]
    color: int
    updated_on: datetime
