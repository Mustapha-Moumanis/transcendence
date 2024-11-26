#!/bin/bash

until PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_NAME" -c '\q' 2>/dev/null; do
    echo "Wait for PostgreSQL to be ready!!"
    sleep 3
done

python ./manage.py makemigrations

python ./manage.py migrate

EXISTS=$(python ./manage.py shell -c "
from users.models import User;
print(User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME', is_superuser=True).exists())
")

if [ "$EXISTS" = "False" ]; then
    python ./manage.py createsuperuser --noinput 2>/dev/null

	python ./manage.py shell -c "
from users.models import User
from chat.models import ChatRoom
user = User.objects.get(username='$DJANGO_SUPERUSER_USERNAME')
user.first_name = '$DJANGO_SUPERUSER_FIRSTNAME'
user.last_name = '$DJANGO_SUPERUSER_LASTNAME'
user.save()
"
fi

# exec python manage.py runsslserver 0.0.0.0:8000 --certificate $CERTS_ --key $P_KEY
exec python manage.py runserver 0.0.0.0:8000