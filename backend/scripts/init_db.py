"""Database initialization and management script"""
from backend.app import create_app, db
from backend.models import User

def init_db():
    """Initialize the database"""
    app = create_app()
    with app.app_context():
        db.create_all()
        print("Database initialized successfully!")

def seed_db():
    """Seed the database with sample data"""
    app = create_app()
    with app.app_context():
        # Clear existing data
        User.query.delete()
        
        # Add sample users
        users = [
            User(name='John Doe', email='john@example.com'),
            User(name='Jane Smith', email='jane@example.com'),
            User(name='Bob Johnson', email='bob@example.com'),
        ]
        
        for user in users:
            db.session.add(user)
        
        db.session.commit()
        print(f"Seeded database with {len(users)} sample users!")

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'seed':
        seed_db()
    else:
        init_db()
