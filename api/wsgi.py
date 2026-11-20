"""Ponto de entrada: `flask --app wsgi run` (dev) ou `gunicorn wsgi:app` (produção)."""
from app import create_app

app = create_app()
