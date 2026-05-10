"""Models package"""
from .user import db, User
from .student import Student
from .teacher_grade import TeacherGrade

__all__ = ['db', 'User', 'Student', 'TeacherGrade']
