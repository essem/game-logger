# docker build -t gldb .
# docker run --rm -e POSTGRES_DB=gameLogger -e POSTGRES_USER=gameLogger -e POSTGRES_PASSWORD=gameLogger -p 5432:5432 gldb

FROM postgres

COPY init-user-db.sh /docker-entrypoint-initdb.d
