# backend/Dockerfile
FROM python:3.9-slim

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    python3-dev \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    libssl-dev \
    libffi-dev \
    && apt-get clean

WORKDIR /app

# Install Python dependencies into a virtual environment
COPY requirements.txt .
RUN python -m venv venv
RUN . venv/bin/activate && pip install --no-cache-dir -r requirements.txt

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose port 8000 and set the entrypoint
EXPOSE 8000
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
