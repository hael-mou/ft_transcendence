FROM python:3.12.2-slim-bullseye

COPY    ./tools/ tools/

RUN     apt-get update && apt-get install -y cron supervisor\
        && python -m venv venv \
        && . /venv/bin/activate \
        && pip install --no-cache-dir --upgrade pip \
        && pip install --no-cache-dir -r /tools/requirements.txt \
        && mv /tools/crontab /etc/cron.d/django-cron \
        && chmod 644 /etc/cron.d/django-cron \
        && chmod +x /tools/entrypoint.sh


ENV     PATH="/venv/bin:$PATH"

COPY    ./app/ app/

WORKDIR /app

EXPOSE 8000

ENTRYPOINT [ "/usr/bin/supervisord", "-c", "/tools/supervisord.conf" ]
