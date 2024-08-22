#!/bin/sh


if [ -d "venv" ]; then
  . venv/bin/activate
fi


echo "Applying database migrations..."
python manage.py migrate


echo "Starting server..."
exec "$@"