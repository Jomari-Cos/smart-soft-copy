import re
from difflib import SequenceMatcher

def parse_pasted_data(text):
    lines = [line.strip() for line in text.strip().split('\n') if line.strip()]
    grades = []
    
    for line in lines:
        parts = re.split(r'[\s,]+', line, maxsplit=1)
        if len(parts) >= 2:
            name = parts[0].strip()
            grade = parts[1].strip()
            grades.append({'name': name, 'grade': grade})
        elif len(parts) == 1:
            remaining = line.strip()
            match = re.match(r'^(.+?)\s+([A-F][+-]?)$', remaining, re.IGNORECASE)
            if match:
                grades.append({'name': match.group(1).strip(), 'grade': match.group(2).strip()})
    
    return {'grades': grades}

def calculate_similarity(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def vlookup_match(teacher_grades, official_students):
    matches = []
    unmatched = []
    
    student_dict = {s['full_name'].lower(): s for s in official_students}
    student_names = list(student_dict.keys())
    
    for item in teacher_grades:
        name = item['name']
        best_match = None
        best_confidence = 0
        
        for official_name in student_names:
            confidence = calculate_similarity(name, official_name)
            if confidence > best_confidence:
                best_confidence = confidence
                best_match = official_name
        
        if best_confidence >= 0.8:
            matches.append({
                'teacher_name': name,
                'official_name': best_match,
                'student_id': student_dict[best_match]['id'],
                'grade': item['grade'],
                'confidence': round(best_confidence, 2)
            })
        else:
            unmatched.append(name)
    
    return {'matches': matches, 'unmatched': unmatched}