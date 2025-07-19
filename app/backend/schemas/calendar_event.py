from pydantic import BaseModel, ConfigDict, Field
from typing import Annotated, Optional
from datetime import datetime


class CalendarEvent(BaseModel):
    id: Optional[int] = None
    start_date: datetime = Field(alias="startDate")
    end_date: datetime = Field(alias="endDate")
    note: Annotated[
        str, Field(max_length=200, description="Note should be 200 characters or less.")
    ]
    color: int
    updated_on: Optional[datetime] = Field(default=None, alias="updatedOn")

    model_config = ConfigDict(validate_by_name=True, validate_by_alias=True)
