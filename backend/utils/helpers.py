"""Utility functions and helpers"""

def validate_email(email):
    """Simple email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def format_response(data, message=None, status='success'):
    """Format API response"""
    response = {
        'status': status,
        'data': data
    }
    if message:
        response['message'] = message
    return response
