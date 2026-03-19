from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from database import Database
from bson import ObjectId
from datetime import datetime

users_bp = Blueprint('users', __name__)

# Initialize database
Database.initialize()

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.find_by_id(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'profile': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'phone': user.get('phone'),
                'role': user['role'],
                'created_at': user['created_at']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        db = Database.get_db()
        update_data = {}

        # Update allowed fields
        if data.get('name'):
            update_data['name'] = data['name']
        if data.get('phone'):
            update_data['phone'] = data['phone']

        if update_data:
            update_data['updated_at'] = datetime.utcnow()

            db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': update_data}
            )

            return jsonify({'message': 'Profile updated successfully'}), 200
        else:
            return jsonify({'error': 'No data to update'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500
