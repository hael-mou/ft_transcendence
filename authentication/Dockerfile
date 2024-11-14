FROM python:3.12.2-slim-bullseye

COPY ./app /app

WORKDIR /app

RUN python -m venv .venv && \
    .venv/bin/pip install --upgrade pip && \
    .venv/bin/pip install -r /app/requirements.txt && \
    chmod +x entrypoint.sh

ENV PATH="/app/.venv/bin:$PATH"

ENTRYPOINT ["./entrypoint.sh"]