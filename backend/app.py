from flask import request, jsonify
from flask_migrate import Migrate
from sqlalchemy import or_
from config import create_app, db
from models import Users, Playlist, Video, init_db, Comment, Like, SavedVideo, Teacher
from werkzeug.utils import secure_filename
import os

app = create_app()


# get-user
@app.route('/profile', methods=["GET"])
def get_user():
    users = Users.query.all()
    result = [user.to_json() for user in users]
    comments = [{"video_id": c.video_id, "text": c.text} for c in users.comments]
    likes = [{"video_id": l.video_id} for l in users.likes]
    saved_videos = [{"video_id": s.video_id} for s in users.saved_videos]
    return jsonify(result,
        {'comments': comments,
        'likes': likes,
        'saved_videos': saved_videos
        })

# register
@app.route('/register',methods=["POST"])
def register():
    # data = request.get_json() 
    username = request.form.get("name")
    email = request.form.get("email") 
    password = request.form.get("pass")
    confirm_password = request.form.get("c_pass")
    img_url = request.files.get('profile')

    if not username or not email or not password or not confirm_password:
        return jsonify({'error': 'All fields are required'}), 400
    
    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400
    
    if Users.query.filter_by(username=username).first() or Users.query.filter_by(email=email).first():
        return jsonify({'error': 'Username or email already exists'}), 409
    
    file_path = None
    if img_url:
        filename = secure_filename(img_url.filename)  
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{username}_{filename}")
        img_url.save(file_path)

    try:
        user = Users(username=username, email=email, img_url=file_path)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# login
@app.route('/login',methods=["POST"])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('pass') 
    
    if not email or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    user = Users.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "user Not exsit"})

    # check auth
    if user and user.check_password(password):
        # Authentication successful
        return jsonify({'message': f'Welcome, {user.username}!'}), 200
    else:
        # Authentication failed
        return jsonify({'message': 'Invalid email or password'}), 401


# update-profile
@app.route('/update-profile/<int:id>', methods=['PATCH'])
def update_profile(id):
    try:
        user = Users.query.get(id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get form data
        username = request.form.get("username")
        email = request.form.get("email")
        old_password = request.form.get("old_pass")
        new_password = request.form.get("new_pass")
        confirm_password = request.form.get("c_password")

        # Update basic info if provided
        if username:
            user.username = username
        if email:
            user.email = email

        # Handle password update if old password is provided
        if old_password:
            if not user.check_password(old_password):
                return jsonify({'error': 'Old password is incorrect'}), 400
            if new_password != confirm_password:
                return jsonify({"error": "New password and confirm password do not match"}), 400
            user.set_password(new_password)

        # Handle profile picture upload
        if 'img_url' in request.files:
            img_url = request.files['img_url']
            if img_url.filename != '':
                filename = secure_filename(img_url.filename) 
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"user_{id}_{filename}")
                img_url.save(file_path)
                user.img_url = file_path

        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
@app.route('/courses', methods=["GET"])
def courses():
    playlists = Playlist.query.all()
    return jsonify([{
        "id" : p.id,
        "title": p.title,
    } for p in playlists])

@app.route('/courses/<int:playlist_id>', methods=["GET"])
def videos(playlist_id):
    playlist = Playlist.query.get(playlist_id)

    if not playlist:
        return jsonify({"message" : " No playlist found"})
    
    videos = Video.query.filter_by(playlist_id=playlist_id).all()
    return jsonify([{
        "id" : v.id,
        "title" : v.title,
        "description" : v.description,
        "thumbnail" : v.thumbnail,
        "video_url": v.video_url
    } for v in videos])

# search bar
@app.route('/search', methods=["GET"])
def search():
    query = request.args.get("q", "")

    if not query:
        return jsonify({'message': 'Please provide a search term.'}), 404
    
    user_result = Users.query.filter(
        or_(
            Users.username.ilike(f"%{query}%"),
            Users.email.ilike(f"%{query}%"),
            Users.id.ilike(f"%{query}%"),
        ).union()
    ).all()

    playlist_result = Playlist.query.filter(
        Playlist.title.ilike(f"%{query}%")
    ).all()

    videos_result = Video.query.filter(
        Video.title.ilike(f"%{query}%"),
        Video.description.ilike(f"%{query}%"),
        Video.video_url.ilike(f"%{query}%")
    ).all()

    # Combine all results
    combined_results = {
        'users': [
            {'id': Users.id, 'name': Users.username, 'email': Users.email, 'img_url': Users.img_url}
            for user in user_result
        ],
        'videos': [
            {'id': Video.id, 'title': Video.title, 'description': Video.description, 'url': Video.video_url}
            for video in videos_result
        ],
        'playlists': [
            {'id': Playlist.id, 'tilte' : Playlist.title}
            for playlist in playlist_result
        ]
    }

    return jsonify(combined_results), 200

# videos
@app.route('/courses/<int:playlist_id>/<int:video_id>', methods=['GET'])
def get_video(playlist_id, video_id):
    playlist = Playlist.query.get(playlist_id)

    if not playlist:
        return jsonify({"error": "Playlist not found"}), 400
    video = Video.query.filter_by(id = video_id, playlist_id= playlist_id).first()

    if not video:
        return jsonify({"error": "Video not found in this playlist"}), 404
    
    return jsonify({
        "playlist_id": playlist.id,
        "playlist_title": playlist.title,
        "video_id": video.id,
        "video_title": video.title,
        "description": video.description,
        "video_url": video.video_url,
        "thumbnail": video.thumbnail
    })


@app.route('/courses/<int:playlist_id>/<int:video_id>/comment', methods=['POST'])
def comments(playlist_id, video_id):
    data = request.json
    user_id = data.get('user_id')
    video_id = data.get('video_id')
    comment_text = data.get('text')

    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 400

    if not user_id:
        return jsonify({"error": " user ID require"})
    video = Video.query.get(video_id)
    if not video:
        return jsonify({'error': 'Video not found'}), 404

    comment = Comment(text=comment_text, user_id= user_id, video_id=video_id)

    db.session.add(comment)
    db.session.commit()
    return jsonify({'message': 'Comment added successfully!'}), 201

@app.route('/courses/<int:playlist_id>/<int:video_id>/like', methods = ['POST'])
def like_video(playlist_id, video_id):
    data = request.json
    user_id = data.get('user_id')
    video_id = data.get('video_id')

    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 400

    if not user_id:
        return jsonify({"error": " user ID require"})
    video = Video.query.get(video_id)
    if not video:
        return jsonify({'error': 'Video not found'}), 404
    
    # chick if liked before
    existing_like = Like.query.filter_by(user_id=user_id, video_id=video_id).first()
    if existing_like:
        return jsonify({'error': 'You already liked this video'}), 400

    like = Like(video_id=video_id, user_id=user_id)
    db.session.add(like)
    db.session.commit()

    return jsonify({'message': 'Video liked successfully!'}), 201

@app.route('/courses/<int:playlist_id>/<int:video_id>/save', methods = ['POST'])
def save_video(video_id):
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    video = Video.query.get(video_id)
    if not video:
        return jsonify({'error': 'Video not found'}), 404

    # Check if video is already saved
    existing_save = SavedVideo.query.filter_by(video_id=video_id, user_id=user_id).first()
    if existing_save:
        return jsonify({'error': 'You already saved this video'}), 400

    saved_video = SavedVideo(video_id=video_id, user_id=user_id)
    db.session.add(saved_video)
    db.session.commit()

    return jsonify({'message': 'Video saved successfully!'}), 201

# Initialize Flask-Migrate
migrate = Migrate(app, db)


# Create a new teacher
@app.route('/teachers', methods=["POST"])
def create_teacher():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    bio = data.get("bio")
    subject = data.get("subject")
    img_url = request.files['img_url'] if 'img_url' in request.files else None

    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400

    if Teacher.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 409

    if img_url:
        filename = secure_filename(img_url.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"teacher_{email}_{filename}")
        img_url.save(file_path)

    teacher = Teacher(name=name, email=email, bio=bio, subject=subject, img_url=file_path if img_url else None)
    db.session.add(teacher)
    db.session.commit()

    return jsonify({'message': 'Teacher created successfully'}), 201

# Get all teachers
@app.route('/teachers', methods=["GET"])
def get_teachers():
    teachers = Teacher.query.all()
    return jsonify([teacher.to_json() for teacher in teachers])

# Get teacher by ID
@app.route('/teachers/<int:id>', methods=["GET"])
def get_teacher(id):
    teacher = Teacher.query.get(id)
    if not teacher:
        return jsonify({"message": "Teacher not found"}), 404
    return jsonify(teacher.to_json())

# Update teacher 
@app.route('/teachers/<int:id>', methods=["PATCH"])
def update_teacher(id):
    teacher = Teacher.query.get(id)
    if not teacher:
        return jsonify({'error': 'Teacher not found'}), 404

    data = request.json
    teacher.name = data.get("name", teacher.name)
    teacher.email = data.get("email", teacher.email)
    teacher.bio = data.get("bio", teacher.bio)
    teacher.subject = data.get("subject", teacher.subject)

    if 'img_url' in request.files:
        img_url = request.files['img_url']
        filename = secure_filename(img_url.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"teacher_{id}_{filename}")
        img_url.save(file_path)
        teacher.img_url = file_path

    db.session.commit()
    return jsonify({"message": "Teacher updated successfully"}), 200

# Delete teacher
@app.route('/teachers/<int:id>', methods=["DELETE"])
def delete_teacher(id):
    teacher = Teacher.query.get(id)
    if not teacher:
        return jsonify({'error': 'Teacher not found'}), 404

    db.session.delete(teacher)
    db.session.commit()
    return jsonify({"message": "Teacher deleted successfully"}), 200





if __name__ == '__main__':
    with app.app_context():
        db.drop_all()
        db.create_all()
        init_db()

    app.run(debug=True)
