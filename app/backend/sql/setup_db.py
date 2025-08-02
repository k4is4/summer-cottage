import models
from database import get_engine

engine = get_engine()

models.Base.metadata.create_all(bind=engine)
