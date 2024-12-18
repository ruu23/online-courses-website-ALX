from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql+pymysql://root:1B12o202r*@localhost:3306/data'
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config['UPLOAD_FOLDER'] = '/online-courses-website/backend/uploads/img_url/'
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    db.init_app(app)
    
    return app