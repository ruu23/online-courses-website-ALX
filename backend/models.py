from config import db
from werkzeug.security import generate_password_hash, check_password_hash


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(300), nullable=False)
    img_url = db.Column(db.String(200), nullable=True)

    def set_password(self, password):
        self.password_hash =generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash,password)
    
    def to_json(self):
        return {
            "id": self.id,
            "user_Name": self.username,
            "imgUrl":self.img_url,

        }

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    video_url = db.Column(db.String(200), nullable=False)
    thumbnail = db.Column(db.String(200), nullable=False)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlist.id'), nullable=False)

class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    Videos = db.relationship('Video', backref='playlist', lazy=True)



class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(300), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'), nullable=False)

    user = db.relationship('Users', backref='comments') # backref will create a new column in the class Users named comments
    video = db.relationship('Video', backref='comments') # backref will create a new column in the class Video named comments

class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'), nullable=False)

    user = db.relationship('Users', backref='likes') 
    video = db.relationship('Video', backref='likes') 

class SavedVideo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('Users', backref='saved_videos')
    video = db.relationship('Video', backref='saved_by_users')

# Teacher Section



    def to_json(self):

        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "subject": self.subject,
            "profile_picture": self.profile_picture,
            "bio": self.bio,
            "subject": self.subject,
            "imgUrl": self.img_url,
        }  

def init_db():
    playlist_html = Playlist(title= "Complete HTML Tutorial")
    video1_html = Video(
                title = "Complete HTML Tutorial (Part 01)",
                description = "Introduction and What I Need To Learn",
                video_url = "static/videos/Html/Html_v1.mp4",
                thumbnail = "static/imgs/Html/html-1.png",
                playlist=playlist_html
    )
    video2_html = Video(
                title = "Complete HTML Tutorial (Part 02)",
                description = "Elements And Browser",
                video_url = "static/videos/Html_v2.mp4", 
                thumbnail = "static/imgs/Html/html-2.png",
                playlist=playlist_html
    )
    video3_html = Video(
                title = "Complete HTML Tutorial (Part 03)",
                description = "First Project And First Page",
                video_url = "static/videos/Html/Html_v3.mp4", 
                thumbnail = "static/imgs/Html/html-3.png",
                playlist=playlist_html
    )
    video4_html = Video(
                title = "Complete HTML Tutorial (Part 04)",
                description = "Head And Nested Elements",
                video_url = "static/videos/Html/Html_v4.mp4", 
                thumbnail = "static/imgs/Html/html-4.png",
                playlist=playlist_html
    )
    video5_html = Video(
                title = "Complete HTML Tutorial (Part 05)",
                description = "Comments And Use Cases",
                video_url = "static/videos/Html/Html_v5.mp4", 
                thumbnail = "static/imgs/Html/html-5.png",
                playlist=playlist_html
    )
    video6_html = Video(
                title = "Complete HTML Tutorial (Part 06)",
                description = "Doctype And Standard And Quirks Mode",
                video_url = "static/videos/Html/Html_v6.mp4", 
                thumbnail = "static/imgs/Html/html-6.png",
                playlist=playlist_html
    )

    db.session.add(playlist_html)
    db.session.add_all([video1_html, video2_html, video3_html, video4_html, video5_html, video6_html])
    db.session.commit()

    playlist_CSS = Playlist(title= "Complete CSS Tutorial")
    video1_CSS = Video(
                title = "Complete CSS Tutorial (Part 01)",
                description = " Introduction And What I Need To Learn",
                video_url = "static/videos/CSS/CSS_v1.mp4.mp4", 
                thumbnail = "static/imgs/CSS/css-1.png",# missed
                playlist=playlist_CSS
    )
    video2_CSS = Video(
                title = "Complete CSS Tutorial (Part 02)",
                description = "Your First Project And Syntax",
                video_url = "static/videos/CSS/CSS_v2.mp4.mp4", 
                thumbnail = "static/imgs/CSS/css-2.png",# missed
                playlist=playlist_CSS
    )
    video3_CSS = Video(
                title = "Complete CSS Tutorial (Part 03)",
                description = "Element Styling",
                video_url = "static/videos/CSS/CSS_v3.mp4", 
                thumbnail = "static/imgs/CSS/css-3.png",# missed
                playlist=playlist_CSS
    )
    video4_CSS = Video(
                title = "Complete CSS Tutorial (Part 04)",
                description = "Name Conventions And Rules",
                video_url = "static/videos/CSS/CSS_v4.mp4", 
                thumbnail = "static/imgs/CSS/css-4.png",# missed
                playlist=playlist_CSS
    )
    video5_CSS = Video(
                title = "Complete CSS Tutorial (Part 05)",
                description = "Background - Color, Image, Repeat",
                video_url = "static/videos/CSS/CSS_v5.mp4", 
                thumbnail = "static/imgs/CSS/css-5.png",# missed
                playlist=playlist_CSS
    )
    video6_CSS = Video(
                title = "Complete CSS Tutorial (Part 06)",
                description = "Background - Attachment, Position, Size",
                video_url = "static/videos/CSS/CSS_v6.mp4", 
                thumbnail = "static/imgs/CSS/css-6.png",# missed
                playlist=playlist_CSS
    )

    db.session.add(playlist_CSS)
    db.session.add_all([video1_CSS, video2_CSS, video3_CSS, video4_CSS, video5_CSS, video6_CSS])
    db.session.commit()


    playlist_Bootstrap = Playlist(title= "Complete Bootstrap Tutorial")
    video1_Bootstrap = Video(
                title = "Complete CSS Tutorial (Part 06)",
                description = "Background - Attachment, Position, Size",
                video_url = "static/videos/CSS/CSS_v6.mp4", 
                thumbnail = "static/imgs/CSS/css-6.png", # missed
                playlist=playlist_CSS
    )






