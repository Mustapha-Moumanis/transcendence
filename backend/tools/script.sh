#!/bin/bash

until PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_NAME" -c '\q' 2>/dev/null; do
    echo "Wait for PostgreSQL to be ready!!"
    sleep 3
done

python ./manage.py makemigrations

python ./manage.py migrate

python ./manage.py createsuperuser --noinput  2>/dev/null

exec python manage.py runserver 0.0.0.0:8000