import uuid
from flask import Blueprint, request, jsonify
from backend.services import UserService
from backend.services.grade_service import parse_pasted_data, vlookup_match
from backend.models import db, Student, TeacherGrade

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/hello', methods=['POST'])
def hello():
    data = request.get_json()
    name = data.get('name', 'World')
    message = f'Hello, {name}!'
    return jsonify({'message': message})

@api_bp.route('/users', methods=['GET'])
def get_users():
    users = UserService.get_all_users()
    return jsonify([user.to_dict() for user in users])

@api_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email are required'}), 400
    user = UserService.create_user(data['name'], data['email'])
    return jsonify(user.to_dict()), 201

@api_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = UserService.get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict())

@api_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = UserService.update_user(user_id, data)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict())

@api_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    success = UserService.delete_user(user_id)
    if not success:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'message': 'User deleted successfully'})

@api_bp.route('/parse-grades', methods=['POST'])
def parse_grades():
    data = request.get_json()
    text = data.get('text', '')
    result = parse_pasted_data(text)
    return jsonify(result)

@api_bp.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([s.to_dict() for s in students])

@api_bp.route('/students', methods=['POST'])
def add_student():
    data = request.get_json()
    registrar_id = data.get('registrar_id')
    if not registrar_id:
        registrar_id = f"STU-{uuid.uuid4().hex[:8]}"
    student = Student(
        registrar_id=registrar_id,
        full_name=data.get('full_name'),
        email=data.get('email')
    )
    db.session.add(student)
    db.session.commit()
    return jsonify(student.to_dict()), 201

@api_bp.route('/vlookup-match', methods=['POST'])
def match_grades():
    data = request.get_json()
    grades = data.get('grades', [])
    students = Student.query.all()
    student_list = [{'id': s.id, 'full_name': s.full_name} for s in students]
    result = vlookup_match(grades, student_list)
    return jsonify(result)

@api_bp.route('/teacher-grades', methods=['GET'])
def get_teacher_grades():
    grades = TeacherGrade.query.all()
    return jsonify([g.to_dict() for g in grades])

@api_bp.route('/teacher-grades', methods=['POST'])
def save_teacher_grade():
    data = request.get_json()
    grade = TeacherGrade(
        teacher_submitted_name=data.get('teacher_submitted_name'),
        matched_student_id=data.get('matched_student_id'),
        grade=data.get('grade'),
        confidence_level=data.get('confidence_level', 0),
        verified=data.get('verified', False),
        course_id=data.get('course_id')
    )
    db.session.add(grade)
    db.session.commit()
    return jsonify(grade.to_dict()), 201

@api_bp.route('/teacher-grades/<int:grade_id>', methods=['PUT'])
def update_teacher_grade(grade_id):
    data = request.get_json()
    grade = TeacherGrade.query.get(grade_id)
    if not grade:
        return jsonify({'error': 'Grade not found'}), 404
    if 'verified' in data:
        grade.verified = data['verified']
    if 'matched_student_id' in data:
        grade.matched_student_id = data['matched_student_id']
    db.session.commit()
    return jsonify(grade.to_dict())

@api_bp.route('/submit-grades', methods=['POST'])
def submit_grades():
    data = request.get_json()
    grades = data.get('grades', [])
    submitted = []
    for g in grades:
        grade = TeacherGrade.query.get(g.get('id'))
        if grade:
            grade.verified = True
            if 'matched_student_id' in g and g['matched_student_id'] is not None:
                grade.matched_student_id = g['matched_student_id']
            if 'confidence' in g:
                grade.confidence_level = g['confidence']
            submitted.append(grade.to_dict())
    db.session.commit()
    return jsonify({'submitted': len(submitted)})
