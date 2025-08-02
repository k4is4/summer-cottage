- Startup command locally: uvicorn main:app --reload
- Startup command in Azure App Service Web App: "gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app"

- ENVIRONMENT VARIABLES:
  AZURE_SQL_SERVER=<servername>.database.windows.net
  AZURE_SQL_DATABASE=<databasename>
