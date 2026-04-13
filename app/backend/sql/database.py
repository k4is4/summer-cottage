import logging
import os
import struct
import time
import urllib
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker, Session
from azure.identity import DefaultAzureCredential

from dotenv import load_dotenv


load_dotenv()

server = os.getenv("AZURE_SQL_SERVER")
database = os.getenv("AZURE_SQL_DATABASE")

_credential = DefaultAzureCredential()
_engine = None
_SessionLocal = None


def _get_engine():
    global _engine, _SessionLocal
    if _engine is not None:
        return _engine

    token = _credential.get_token("https://database.windows.net/.default").token
    token_bytes = token.encode("UTF-16-LE")
    token_struct = struct.pack(f"<I{len(token_bytes)}s", len(token_bytes), token_bytes)

    conn_str = (
        f"DRIVER={{ODBC Driver 18 for SQL Server}};"
        f"SERVER=tcp:{server},1433;"
        f"DATABASE={database};"
        f"Encrypt=yes;"
        f"TrustServerCertificate=yes;"
    )

    params = urllib.parse.quote(conn_str)
    _engine = create_engine(
        "mssql+pyodbc:///?odbc_connect={0}".format(params),
        connect_args={"attrs_before": {1256: token_struct}},
        pool_pre_ping=True,
    )
    _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
    return _engine


_DB_WAKEUP_RETRIES = 5
_DB_WAKEUP_DELAY = 10  # seconds between retries


def _get_db_session() -> Session:
    """Create a session, retrying if the database is waking up from sleep."""
    _get_engine()
    last_exc: Exception = None
    for attempt in range(_DB_WAKEUP_RETRIES):
        db: Session = _SessionLocal()
        try:
            db.execute(text("SELECT 1"))
            return db
        except OperationalError as e:
            db.close()
            last_exc = e
            if attempt < _DB_WAKEUP_RETRIES - 1:
                logging.warning(
                    "Database not ready (attempt %d/%d), retrying in %ds...",
                    attempt + 1,
                    _DB_WAKEUP_RETRIES,
                    _DB_WAKEUP_DELAY,
                )
                time.sleep(_DB_WAKEUP_DELAY)
    logging.error("Database unavailable after %d attempts.", _DB_WAKEUP_RETRIES)
    raise last_exc


def get_db():
    db = _get_db_session()
    try:
        yield db
    finally:
        db.close()
