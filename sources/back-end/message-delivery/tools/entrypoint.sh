#!/bin/sh

set -e

sleep 4
echo "===============================>>> Start Setup <<<==============================="
. /venv/bin/activate

python  /app/manage.py makemigrations
python  /app/manage.py migrate --noinput
python /app/manage.py remove_all_connections

echo "==============================>>> Start Server <<<==============================="
exec python3 /app/manage.py runserver 0.0.0.0:8000
