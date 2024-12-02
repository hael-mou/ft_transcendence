#!/bin/sh

set -e

echo "===============================>>> Start Setup <<<==============================="
. /venv/bin/activate
export  SSL_CERT_FILE=$(python -m certifi)
echo    $GOOGLE_CLIENT_SECRET_JSON > $GOOGLE_CLIENT_SECRET_FILE


echo "===============================>>> Start Migration <<<==========================="

python  /app/manage.py makemigrations
python  /app/manage.py migrate --noinput

echo "==============================>>> Start Server <<<==============================="
exec "$@"
