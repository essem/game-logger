psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
\c gameLogger
CREATE EXTENSION pgcrypto;
EOSQL
