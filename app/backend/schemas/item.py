from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Annotated
from datetime import datetime


class Item(BaseModel):
    id: Optional[int] = None
    name: Annotated[
        str,
        Field(
            min_length=2,
            max_length=30,
            description="Name should be between 2 and 30 characters.",
        ),
    ]
    status: int
    comment: Annotated[
        Optional[str],
        Field(max_length=100, description="Comment should be 100 characters or less."),
    ] = None

    category: int
    updated_on: Optional[datetime] = Field(default=None, alias="updatedOn")

    model_config = ConfigDict(validate_by_name=True, validate_by_alias=True)
