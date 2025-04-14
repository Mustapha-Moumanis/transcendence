![Transcendence Header](readme-utils/header.gif)

# 🕹️ Transcendence

**Transcendence** is a full-stack web application that reimagines the classic Pong game into a modern multiplayer experience with social features, competitive gameplay, and real-time interactions.


[🎥 Watch Demo on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7295861797364850689/)

## 📌 Overview

Transcendence was developed collaboratively by:

- **[Mustapha Moumanis](https://github.com/Mustapha-Moumanis)** - Backend, Auth & Security
- **[Souad Hilal](https://github.com/SoTizme)** - Frontend & Real-Time Communication
- **[Anir Zaher](https://github.com/TenshiIsCoding)** - 3D Game & Tournaments

---

## 🚀 Features

### 🔐 Authentication & Security (by Mustapha Moumanis)
- JWT-based authentication
- Google OAuth2 and Intra login support
- Two-Factor Authentication (2FA)
- Password reset and recovery
- Single Page Application (SPA) with vanilla JavaScript
- Fully containerized using **Docker**, **Nginx**, and **PostgreSQL**

### 💬 Real-Time Chat & UI (by Souad Hilal)
- UI designed with Figma
- Real-time messaging with WebSockets
- Typing indicators, message notifications
- Friends system: add/remove/block in real time
- Built with HTML, CSS, Bootstrap, and JS

### 🕹️ 3D Game & Tournaments (by Anir Zaher)
- Modern 3D Pong game using **Three.js**
- Real-time local 1v1 matches with live scoring
- Smooth animations and user feedback
- Tournament mode with game brackets

---

## 🧱 Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Bootstrap, Three.js
- **Backend:** Python, Django, Django REST Framework, Django Channels
- **Database:** PostgreSQL
- **Auth:** dj-rest-auth, allauth, JWT, OAuth2
- **DevOps:** Docker, Nginx

---

## 📦 Running the Application

```bash
git clone https://github.com/Mustapha-Moumanis/transcendence.git
cd transcendence
cp .env-example .env
# Make sure to edit the .env file and provide all required configurations before proceeding.
docker-compose up --build
```