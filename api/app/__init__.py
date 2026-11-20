"""Fábrica da aplicação Flask (padrão "application factory")."""
from flask import Flask
from flask_smorest import Api

from app.config import build_config
from app.db import db
from app.routes.health import blp as health_blp


def create_app(overrides: dict | None = None) -> Flask:
    app = Flask(__name__)
    app.json.ensure_ascii = False  # mantém acentos nas respostas JSON

    # A configuração precisa estar pronta ANTES do Api(app).
    app.config.update(build_config(overrides))

    db.init_app(app)

    api = Api(app)
    api.register_blueprint(health_blp)

    return app
