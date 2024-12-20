# This file for initializing the database
from config import create_app, db

app = create_app()

with app.app_context():
    db.create_all()  # This will create the tables based on your models

print("Database initialized!")
