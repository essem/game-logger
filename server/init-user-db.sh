psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
CREATE USER "gameLogger";
CREATE DATABASE "gameLogger";
GRANT ALL PRIVILEGES ON DATABASE "gameLogger" TO "gameLogger";
\c gameLogger
CREATE EXTENSION pgcrypto;
EOSQL
