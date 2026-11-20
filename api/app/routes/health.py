"""Verificações de saúde, usadas pelo Kubernetes (livenessProbe e readinessProbe)."""
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from marshmallow import Schema, fields

from app.db import db

blp = Blueprint(
    "health",
    __name__,
    url_prefix="/v1/health",
    description="Verificações de saúde da API",
)


class StatusSchema(Schema):
    status = fields.String(metadata={"example": "ok"})


@blp.route("")
class Liveness(MethodView):
    @blp.response(200, StatusSchema)
    def get(self):
        """Liveness: o processo está de pé (não consulta o banco)."""
        return {"status": "ok"}


@blp.route("/ready")
class Readiness(MethodView):
    @blp.response(200, StatusSchema)
    def get(self):
        """Readiness: a API consegue falar com o banco."""
        if not db.ping():
            abort(503, message="Banco de dados indisponível")
        return {"status": "ready"}
