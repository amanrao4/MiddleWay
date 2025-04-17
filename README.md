# MiddleWay Platform

MiddleWay is a full-stack web application designed to help users find a mutually convenient meeting spot between two participants. It calculates the midpoint based on manually entered addresses and suggests a nearby restaurant for the meetup. 

---

## 🌐 Live Demo
🚧 Not deployed yet

---

## 🚀 Features

- 🔐 User Authentication (JWT-based)
- 👤 Role-Based Access: Admin, Moderator, and Regular User
- 📍 Location-Based Meetups with midpoint calculation
- 📊 Interactive Map using Leaflet.js
- 📝 Create, Read, and View Meetups
- 🍽️ Suggested restaurant (random) displayed on homepage
- ✅ Form validation and debounced location search

---

## 📁 Project Structure

```
middleway-platform/
├── client/           # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/          # Auth context
│   │   ├── pages/            # All major pages (Login, Register, MeetupFormPage, etc.)
│   │   └── App.js
│   └── package.json
├── server/           # Express backend
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   └── index.js
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend:
- React
- React Bootstrap
- React Router
- Leaflet.js (Map)

### Backend:
- Node.js
- Express
- MongoDB + Mongoose
- JWT Auth
- OpenStreetMap API (via proxy)

---

## 🧪 Running Locally

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/middleway-platform.git
cd middleway-platform
```

### 2️⃣ Setup Backend
```bash
cd server
npm install
# Add your .env with MONGO_URI and JWT_SECRET
npm start
```

### 3️⃣ Setup Frontend
```bash
cd client
npm install
# Add your .env with REACT_APP_API_URL=http://localhost:5000/api
npm start
```

---

## 👥 User Roles
- **Regular User**: Create meetups, search midpoint, view participants.
- **Moderator**: View all meetups, monitor usage.
- **Admin**: View all users, promote users to roles.

Roles are assigned in the database manually (currently).

---

## 📌 Notes
- Rate limits may apply for OpenStreetMap, so usage is debounced and capped.
- Restaurant is hardcoded from a rotating list to keep demo simple.
- Address suggestions are fetched with proxy via Express backend.

---

## 📬 Feedback & Contributions
We welcome contributions! Fork this repo and submit a pull request.

---

## 📄 License
MIT License.
