#!/bin/sh

echo "===============================>>> Start Setup <<<==============================="
. /venv/bin/activate

python  /app/manage.py makemigrations
python  /app/manage.py migrate --noinput

echo "==============================>>> Start Server <<<==============================="
exec "$@"
