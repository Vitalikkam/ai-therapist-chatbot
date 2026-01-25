🤖 Therapist AI Bot
Therapist AI Bot is an intelligent conversational web application designed to provide emotional support, mental wellness guidance, and reflective conversations through AI-powered interactions. The project demonstrates the integration of artificial intelligence with a secure and user-friendly full-stack web platform.

📌 Project Overview
Therapist AI Bot allows users to:
Engage in supportive and empathetic conversations with an AI assistant
Receive stress management tips and mental health guidance
Track conversation history securely
Experience a clean and calming user interface
Access the service through authenticated user accounts
This project was built as a portfolio application to showcase AI integration, backend API development, and frontend interaction design.

🚀 Features
AI-powered chat interface
User authentication and secure sessions
Conversation history storage
Emotion-aware responses (basic sentiment analysis)
Privacy-focused data handling
Responsive and accessible UI
Input validation and error handling
RESTful API integration

🛠 Tech Stack
Backend
Python
Django
Django REST Framework
AI/NLP integration (OpenAI API or similar)
JWT Authentication
PostgreSQL / SQLite
Frontend
React
JavaScript (ES6+)
HTML5 & CSS3
Tools & Other
Git & GitHub
Docker (optional)
Postman (API testing)
Environment variables (.env)

⚠️ Disclaimer
This application is not a replacement for professional medical or psychological treatment.
Therapist AI Bot is intended for educational and supportive purposes only. If you are experiencing severe distress, please seek help from a qualified mental health professional.

⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/therapist-ai-bot.git
cd therapist-ai-bot
2. Backend Setup
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
3. Frontend Setup
cd frontend
npm install
npm start

🔐 Environment Variables
Create a .env file in the backend root:
SECRET_KEY=your_secret_key
DEBUG=True
AI_API_KEY=your_api_key
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

📚 API Endpoints (Sample)
POST /api/auth/register/
POST /api/auth/login/
POST /api/chat/
GET /api/chat/history/
DELETE /api/chat/{id}/

🧪 Testing
python manage.py test

🎯 Future Improvements
Voice-based interaction
Advanced sentiment analysis
Crisis detection and escalation
Multi-language support
Mobile app version
Personal mood tracking dashboard
AI model fine-tuning

![photo_2026-01-25_14-09-34](https://github.com/user-attachments/assets/f15474a0-44bc-4113-8b82-817957c3e969)


🤝 Contributing
Contributions are welcome.
Please open an issue or submit a pull request.

👨‍💻 Author
Vitalii Kamulia
Full Stack Web Developer
GitHub: https://github.com/Vitalikkam
