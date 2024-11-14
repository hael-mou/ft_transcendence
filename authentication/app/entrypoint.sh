#!/bin/bash
export SSL_CERT_FILE=$(python -m certifi) # just export had varibale ya change the backendofEmail

python /app/manage.py makemigrations
python /app/manage.py migrate --noinput

echo "===============================>>> Start Server <<<==============================="

gunicorn service_core.wsgi:application -c gunicorn.conf.py