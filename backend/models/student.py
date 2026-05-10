from .user import db

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    registrar_id = db.Column(db.String(50), unique=True, nullable=False)
    full_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(120))
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=db.func.now())
    
    def __repr__(self):
        return f'<Student {self.full_name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'registrar_id': self.registrar_id,
            'full_name': self.full_name,
            'email': self.email,
            'status': self.status
        }