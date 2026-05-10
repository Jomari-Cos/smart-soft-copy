from .user import db

class TeacherGrade(db.Model):
    __tablename__ = 'teacher_grades'
    
    id = db.Column(db.Integer, primary_key=True)
    teacher_submitted_name = db.Column(db.String(150), nullable=False)
    matched_student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=True)
    grade = db.Column(db.String(10), nullable=False)
    confidence_level = db.Column(db.Float, default=0.0)
    verified = db.Column(db.Boolean, default=False)
    course_id = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=db.func.now())
    
    matched_student = db.relationship('Student', backref='teacher_grades')
    
    def __repr__(self):
        return f'<TeacherGrade {self.teacher_submitted_name} - {self.grade}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'teacher_submitted_name': self.teacher_submitted_name,
            'matched_student_id': self.matched_student_id,
            'student_name': self.matched_student.full_name if self.matched_student else None,
            'grade': self.grade,
            'confidence_level': self.confidence_level,
            'verified': self.verified,
            'course_id': self.course_id
        }