from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from PIL import Image, ImageDraw

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, static_folder='static')
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5174","http://localhost:5173", "http://localhost:3000"],
            "methods": ["GET", "POST", "PATCH", "DELETE"],
            "allow_headers": ["Content-Type"]
        }
    })
        
    app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql+pymysql://root:1B12o202r*@localhost:3306/data'
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    db.init_app(app)
    
    return app