from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
from database import Database

auth_bp = Blueprint('auth', __name__)

# Initialize database
Database.initialize()

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()

        email = (data.get('email') or '').strip().lower()
        phone = (data.get('phone') or '').strip()

        # Validate required fields
        if not data.get('name') or not email or not data.get('password'):
            return jsonify({'error': 'Name, email and password are required'}), 400

        # Check if user already exists
        if User.find_by_email(email):
            return jsonify({'error': 'Email already registered'}), 400

        # Create new user
        user = User(
            name=data['name'],
            email=email,
            password=data['password'],
            phone=phone,
            role=data.get('role', 'farmer')
        )

        user_id = user.save()

        # Create access token
        access_token = create_access_token(identity=user_id)

        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': user_id,
                'name': data['name'],
                'email': email,
                'role': data.get('role', 'farmer')
            }
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()

        identifier = (data.get('identifier') or data.get('email') or '').strip()
        password = data.get('password')

        # Validate required fields
        if not identifier or not password:
            return jsonify({'error': 'Email/mobile and password are required'}), 400

        # Find user by email or phone
        if '@' in identifier:
            user = User.find_by_email(identifier)
        else:
            user = User.find_by_phone(identifier) or User.find_by_email(identifier)

        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        # Verify password
        if not User.verify_password(user['password'], password):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Create access token
        access_token = create_access_token(identity=str(user['_id']))

        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user info"""
    try:
        user_id = get_jwt_identity()
        user = User.find_by_id(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'phone': user.get('phone'),
                'role': user['role']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
