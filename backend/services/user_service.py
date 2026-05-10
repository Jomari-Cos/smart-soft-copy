from backend.models import db, User

class UserService:
    """User service for handling business logic"""
    
    @staticmethod
    def get_all_users():
        """Get all users"""
        return User.query.all()
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get a user by ID"""
        return User.query.get(user_id)
    
    @staticmethod
    def get_user_by_email(email):
        """Get a user by email"""
        return User.query.filter_by(email=email).first()
    
    @staticmethod
    def create_user(name, email):
        """Create a new user"""
        user = User(name=name, email=email)
        db.session.add(user)
        db.session.commit()
        return user
    
    @staticmethod
    def update_user(user_id, data):
        """Update a user"""
        user = User.query.get(user_id)
        
        if not user:
            return None
        
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
        
        db.session.commit()
        return user
    
    @staticmethod
    def delete_user(user_id):
        """Delete a user"""
        user = User.query.get(user_id)
        
        if not user:
            return False
        
        db.session.delete(user)
        db.session.commit()
        return True
