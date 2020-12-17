# docker build -t gldb .
# docker run --name gldb -d -e POSTGRES_DB=gameLogger -e POSTGRES_USER=gameLogger -e POSTGRES_PASSWORD=gameLogger -p 5432:5432 gldb
# cat data.sql | docker exec -i gldb psql --username=gameLogger
# docker exec -it gldb psql --username=gameLogger

FROM postgres

COPY init-user-db.sh /docker-entrypoint-initdb.d
