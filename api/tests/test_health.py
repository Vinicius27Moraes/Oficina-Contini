import pytest

from app import create_app
from app.db import normalize_database_url


@pytest.fixture
def client():
    app = create_app({"TESTING": True, "DATABASE_URL": None})
    return app.test_client()


def test_liveness(client):
    resposta = client.get("/v1/health")
    assert resposta.status_code == 200
    assert resposta.get_json() == {"status": "ok"}


def test_readiness_falha_sem_banco(client):
    assert client.get("/v1/health/ready").status_code == 503


def test_openapi_publicado(client):
    resposta = client.get("/v1/openapi.json")
    assert resposta.status_code == 200
    assert any(caminho.startswith("/v1/health") for caminho in resposta.get_json()["paths"])


def test_swagger_ui_abre(client):
    assert client.get("/v1/docs").status_code == 200


def test_docs_desligadas(monkeypatch):
    monkeypatch.setenv("ENABLE_DOCS", "false")
    app = create_app({"TESTING": True, "DATABASE_URL": None})
    cliente = app.test_client()
    assert cliente.get("/v1/docs").status_code == 404
    assert cliente.get("/v1/openapi.json").status_code == 404
    assert cliente.get("/v1/health").status_code == 200  # a API continua funcionando


def test_remove_parametros_do_prisma():
    url = "postgresql://oficina:abc@postgres:5432/oficina?schema=public&connection_limit=5"
    assert normalize_database_url(url) == "postgresql+psycopg://oficina:abc@postgres:5432/oficina"


def test_preserva_parametros_validos():
    url = "postgresql://u:p@h:5432/d?schema=public&sslmode=require"
    assert normalize_database_url(url).endswith("?sslmode=require")
