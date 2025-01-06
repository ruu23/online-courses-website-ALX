# An official Python runtime as a parent image
FROM python:3.12-slim

# The working directory in the container
WORKDIR /app

# Copy the backend requirements and application
COPY ./backend/requirements.txt /app/requirements.txt
COPY ./backend /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the Flask app's port (5000)
EXPOSE 5000

# Set the environment variable for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run the Flask application
CMD ["flask", "run"]
