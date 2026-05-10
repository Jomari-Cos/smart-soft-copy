# Professional Flask Web Application

A production-ready Flask web application with separated frontend and backend architecture.

## Deployment to Render

### Prerequisites
- A Render account (https://render.com)
- Your project pushed to GitHub

### Steps to Deploy

1. **Connect your repository:**
   - Go to https://dashboard.render.com
   - Click "New +" and select "Blueprint"
   - Connect your GitHub repository

2. **Deploy using the blueprint:**
   - Render will automatically detect the `render.yaml` file
   - The blueprint will create:
     - A web service for your Flask app
     - A PostgreSQL database
   - Click "Apply" to start the deployment

3. **Environment Variables:**
   - `FLASK_ENV` is automatically set to `production`
   - `SECRET_KEY` is auto-generated
   - `DATABASE_URL` is automatically configured by Render

4. **Database Setup:**
   - After deployment, run database migrations if needed:
     ```bash
     render run flask db upgrade
     ```

### Manual Deployment (Alternative)

If you prefer manual setup:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python app.py`
4. Add environment variables:
   - `FLASK_ENV`: `production`
   - `SECRET_KEY`: (generate a secure random key)
5. Add a PostgreSQL database and link it to your service

## Project Structure

```
smart-soft-copyy/
├── app.py                     # Entry point
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── README.md                 # Project documentation
│
├── frontend/                 # Frontend - HTML/CSS/JS
│   ├── templates/
│   │   └── index.html        # Main HTML template
│   └── static/
│       ├── css/
│       │   └── style.css     # Stylesheet
│       └── js/
│           └── script.js     # JavaScript
│
└── backend/                  # Backend - Flask
    ├── app.py                # Flask application factory
    ├── __init__.py
    │
    ├── config/               # Configuration
    │   ├── __init__.py
    │   └── settings.py       # Config classes
    │
    ├── models/               # Database models
    │   ├── __init__.py
    │   └── user.py           # User model
    │
    ├── routes/               # API routes/blueprints
    │   ├── __init__.py
    │   └── api.py            # API endpoints
    │
    ├── services/             # Business logic layer
    │   ├── __init__.py
    │   └── user_service.py   # User service
    │
    ├── utils/                # Helper functions
    │   ├── __init__.py
    │   └── helpers.py        # Utility functions
    │
    └── scripts/              # Utility scripts
        └── init_db.py        # Database initialization
```

## Setup Instructions

### 1. Clone & Navigate
```bash
cd smart-soft-copyy
```

### 2. Create Environment File
```bash
copy .env.example .env
```

### 3. Create Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Initialize Database
```bash
python backend/scripts/init_db.py
```

### 6. Seed Sample Data (Optional)
```bash
python backend/scripts/init_db.py seed
```

### 7. Run Application
```bash
python app.py
```

Open browser: `http://localhost:5000`

## Architecture

### Frontend (HTML/CSS/JS)
- `frontend/templates/` - Jinja2 HTML templates
- `frontend/static/css/` - Stylesheets
- `frontend/static/js/` - Client-side JavaScript

### Backend (Flask)
- `backend/config/` - Environment-based configuration
- `backend/models/` - SQLAlchemy ORM models
- `backend/routes/` - Flask blueprints and API routes
- `backend/services/` - Business logic and database operations
- `backend/utils/` - Helper functions and utilities
- `backend/scripts/` - Utility scripts for management tasks

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/hello` | Greet the user |
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create a new user |
| GET | `/api/users/<id>` | Get a specific user |
| PUT | `/api/users/<id>` | Update a user |
| DELETE | `/api/users/<id>` | Delete a user |

## Features

✅ Separated frontend and backend architecture  
✅ Modular Flask structure with blueprints  
✅ SQLAlchemy ORM for database management  
✅ Configuration management for multiple environments  
✅ Business logic layer (services)  
✅ Database migration support (Flask-Migrate)  
✅ Environment variables (.env) support  
✅ Responsive HTML/CSS/JS frontend  
✅ RESTful API endpoints  
✅ Database initialization scripts  

## Configuration

Edit `.env` file:
```
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
DATABASE_URL=sqlite:///app.db
```

## Development

- Python 3.8+
- Flask 3.0.0
- Flask-SQLAlchemy 3.0.5
- Flask-Migrate 4.0.5
