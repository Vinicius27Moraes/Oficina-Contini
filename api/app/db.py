"""Conexão com o PostgreSQL via SQLAlchemy.

O banco é do Prisma (o schema.prisma é o dono das tabelas). A API apenas
lê e grava nelas; nunca cria nem altera tabelas.
"""
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Parâmetros que só o Prisma entende. O driver Python (psycopg) rejeita
# esses parâmetros com "invalid connection option".
PARAMETROS_SO_DO_PRISMA = {
    "schema",
    "connection_limit",
    "pool_timeout",
    "pgbouncer",
    "socket_timeout",
}


def normalize_database_url(url: str) -> str:
    """Converte a DATABASE_URL do Prisma para uma URL aceita pelo SQLAlchemy."""
    partes = urlsplit(url)

    esquema = partes.scheme
    if esquema in ("postgres", "postgresql"):
        esquema = "postgresql+psycopg"  # usa o driver psycopg 3

    consulta = [
        (chave, valor)
        for chave, valor in parse_qsl(partes.query)
        if chave not in PARAMETROS_SO_DO_PRISMA
    ]
    return urlunsplit((esquema, partes.netloc, partes.path, urlencode(consulta), partes.fragment))


class Database:
    def __init__(self):
        self.engine = None
        self.session_factory = None

    def init_app(self, app):
        url = app.config.get("DATABASE_URL")
        if not url:
            app.logger.warning("DATABASE_URL não definida: a API sobe, mas sem banco.")
            return

        self.engine = create_engine(
            normalize_database_url(url),
            pool_size=app.config["DB_POOL_SIZE"],  # conexões por processo
            max_overflow=0,  # nunca passa do pool_size
            pool_pre_ping=True,  # testa a conexão antes de usar (reconecta se caiu)
        )
        self.session_factory = sessionmaker(bind=self.engine)

    def ping(self) -> bool:
        """True se o banco responde a um SELECT 1."""
        if self.engine is None:
            return False
        try:
            with self.engine.connect() as conexao:
                conexao.execute(text("SELECT 1"))
            return True
        except Exception:
            return False


db = Database()
