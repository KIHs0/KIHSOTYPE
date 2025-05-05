# 🎮 KIHSOTYPE - Blazing Fast Typing Game

<div align="center">
  
  [![Render Badge](https://img.shields.io/badge/Render-Deployed-5C4EE5)](https://kihsotype.onrender.com)
  ![Tech Stack](https://img.shields.io/badge/Stack-MERN-09AC3F)
  ![License](https://img.shields.io/badge/License-MIT-blue)
</div>

![image](https://github.com/user-attachments/assets/3c73d7d7-f978-4403-af3b-e88cca3ae150)
🔗 **Live Demo:** https://kihsotype.onrender.com



## 📌 Overview
Minimalist typing speed tester using MongoDB, Express, Node.js with Vanilla JS frontend. No React - pure DOM manipulation.

## ✨ Key Features
| Feature | Description |
|---------|-------------|
| ⚡ Real-time Metrics | WPM, accuracy, error tracking |
| 📈 User History | MongoDB stores all test results |
| 🎨 Theme Toggle | Dark/light mode support |
| 📱 Responsive | Works on all device sizes |

## 🛠️ Tech Stack
**Frontend**  
![JavaScript](https://img.shields.io/badge/JS-Vanilla%20ES6+-F7DF1E) 
![HTML5](https://img.shields.io/badge/HTML5-E34F26) 
![CSS3](https://img.shields.io/badge/CSS3-1572B6)

**Backend**  
![Node.js](https://img.shields.io/badge/Node.js-339933) 
![Express](https://img.shields.io/badge/Express-000000) 
![MongoDB](https://img.shields.io/badge/MongoDB-47A248)

## 🚀 Quick Start
```bash
# 1. Clone repo
git clone https://github.com/KIHs0/kihsotype.git
cd kihsotype

# 2. Setup backend
cd server
npm install
echo "PORT=5000\nMONGODB_URI=your_connection_string" > .env

# 3. Setup frontend
cd ../client
npm install

# 4. Run (from project root)
npm run dev   # Frontend
npm start     # Backend
```



### 📂 Folder structure
```

KIHSOTYPE/
├── public/
│ ├── index.html # Main UI
│ ├── style.css # Stylesheet
│ └── script.js # Game logic
├── routes/ # Express route handlers
├── models/ # Mongoose schemas (if used)
├── server.js # Express server entry point
├── .env # Environment variables
└── README.md # This file

```


```
🔮 Future Enhancements

    🧾 User registration & authentication

    🏆 Global leaderboard with high scores

    📈 Personal stats tracking & history

    🎨 Dark mode and multiple themes

    🔊 Typing sound effects and animations
```
## 🙌 **Author**
  <div align="center">
  Made with ❤️ -- KIHSO
  </div>
