import os
import struct
import urllib
from sqlalchemy import create_engine
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


def get_db():
    _get_engine()
    db: Session = _SessionLocal()
    try:
        yield db
    except Exception as e:
        print(f"Database connection error: {e}")
        raise
    finally:
        db.close()
