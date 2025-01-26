# 📚 Responsive E-Learning Website

🎉 **Welcome to the ultimate guide to creating a complete responsive multi-page online education website!** This project is perfect for beginners who want to learn how to build a modern e-learning platform like **YouTube** with **React**, **HTML**, **CSS**. 🚀

---
## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup](#setup)
- [Running the Application with Docker](#running-the-application-with-docker)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)

---


## Project Overview

The Online Courses Website is designed to provide an interactive platform for educators and students. It includes features like user registration, course browsing, video streaming, and interactive comment sections.


---
## Technologies Used

- Flask for the backend
- React for the frontend
- Docker and Docker Compose for containerization
- MySQL for database management
- HTML, CSS, and JavaScript for frontend design

---

## Features

### 🌞 **Dynamic Theme Toggler**
- Switch between light and dark modes effortlessly with JavaScript and LocalStorage.

### 📑 **Responsive Design**  
**Built with CSS Grid**, the website adapts beautifully to all screen sizes:  
✔ **Side Bar**: Fully responsive and collapsible.  
✔ **Navbar with Search Box**: Clean and intuitive navigation.  
✔ **Quick View Section**: Organized content previews.  
✔ **About Section**: Informative and professional layout.  
✔ **Courses Section**: Well-structured course display.  
✔ **Video Playlist**: Seamless playlist experience.  
✔ **Contact Form**: Responsive and functional.  
✔ **User Profiles**: Customize your experience.  
✔ **Tutor Profiles**: Showcase your expertise.  
✔ **Forms**: Responsive login, register, and update forms.

---

### 🚀 **Backend Features**:
- **User Authentication**: Secure login and registration.
- **Profile Management**: Update user information, view profiles.
- **Courses Management**: Add, update, and list courses.
- **Course Playlists**: Manage video playlists.
- **Comments and Likes**: Engage with content by commenting and liking videos.
- **Search**: Search through courses, playlists, and users.

---
## Setup

### Prerequisites

Ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

---
## Running the Application with Docker
## 🚀 **Getting Started**

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/online-courses-website.git
```

## 2️⃣ Build and Start the Containers
```bash
docker-compose up --build
docker run -p 3000:3000 online-courses-website-alx-frontend:latest
docker run -p 5000:5000 online-courses-website-alx-backend:latest
```
if you have problem with building docker try this command:
```
docker-compose build --no-cache
docker-compose up --build
docker run -p 3000:3000 online-courses-website-alx-frontend:latest
docker run -p 5000:5000 online-courses-website-alx-backend:latest
```

This command will:

- Build the Docker images for the backend and frontend.
- Start the services defined in docker-compose.yml

## 3️⃣ Access the Application
- Frontend: Navigate to http://localhost:3000.
- Backend: Access the API at http://localhost:5000.

## 📂 Project Structure
```
online-courses-website/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── requirements.txt
│   └── Dockerfile
├── client-side/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
├── .dockerignore
├── docker-compose.yml
└── README.md

```

## Contributing
We’d love your contributions! Feel free to fork, create issues, or submit pull requests.
---
## Endpoints

### User Endpoints
- **GET `/profile`**: Get user profile  
- **POST `/register`**: Register a new user  
- **POST `/login`**: Login a user  
- **PATCH `/update-profile/<int:id>`**: Update user profile  

### Course Endpoints
- **GET `/courses`**: Get all courses  
- **GET `/courses/<int:playlist_id>`**: Get videos in a course  
- **GET `/courses/<int:playlist_id>/<int:video_id>`**: Get a specific video  
- **POST `/courses/<int:playlist_id>/<int:video_id>/comment`**: Add a comment to a video  
- **POST `/courses/<int:playlist_id>/<int:video_id>/like`**: Like a video  
- **POST `/courses/<int:playlist_id>/<int:video_id>/save`**: Save a video  

### Teacher Endpoints
- **POST `/teachers`**: Create a new teacher  
- **GET `/teachers`**: Get all teachers  
- **GET `/teachers/<int:id>`**: Get a specific teacher  
- **PATCH `/teachers/<int:id>`**: Update a teacher   
---
## License
This project is licensed under the MIT License.
---

## 🙌 Acknowledgments
Special thanks to all learners and developers who inspire us to create and share!
