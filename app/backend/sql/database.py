import os
import struct
import urllib
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from azure.identity import DefaultAzureCredential

from dotenv import load_dotenv

load_dotenv()


server = os.getenv("AZURE_SQL_SERVER")
database = os.getenv("AZURE_SQL_DATABASE")


credential = DefaultAzureCredential()
token = credential.get_token("https://database.windows.net/.default").token
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
engine = create_engine(
    "mssql+pyodbc:///?odbc_connect={0}".format(params),
    connect_args={"attrs_before": {1256: token_struct}},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
