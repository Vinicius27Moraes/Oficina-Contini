"""Configuração lida das variáveis de ambiente (nunca fixe segredos no código)."""
import os


def _bool(valor: str | None, padrao: bool) -> bool:
    if valor is None:
        return padrao
    return valor.strip().lower() in ("1", "true", "yes", "sim")


def build_config(overrides: dict | None = None) -> dict:
    docs = _bool(os.getenv("ENABLE_DOCS"), True)

    cfg = {
        "API_TITLE": "API Oficina Mecânica",
        "API_VERSION": "v1",
        # Obrigatório para o flask-smorest, mesmo com a documentação desligada.
        "OPENAPI_VERSION": "3.0.3",
        "ENABLE_DOCS": docs,
        "DATABASE_URL": os.getenv("DATABASE_URL"),
        "DB_POOL_SIZE": int(os.getenv("DB_POOL_SIZE", "5")),
    }

    # Sem OPENAPI_URL_PREFIX o flask-smorest não publica nem o JSON nem o Swagger UI.
    # Assim ENABLE_DOCS=false esconde a documentação na exposição pública.
    if docs:
        cfg.update(
            {
                "OPENAPI_URL_PREFIX": "/v1",
                "OPENAPI_JSON_PATH": "openapi.json",
                "OPENAPI_SWAGGER_UI_PATH": "/docs",
                "OPENAPI_SWAGGER_UI_URL": "https://cdn.jsdelivr.net/npm/swagger-ui-dist/",
            }
        )

    if overrides:
        cfg.update(overrides)
    return cfg
