from datetime import datetime
from database import Database
from bson import ObjectId
import bcrypt
import re

class User:
    """User model"""

    def __init__(self, name, email, password, phone=None, role='farmer'):
        self.name = name
        self.email = email.strip().lower() if isinstance(email, str) else email
        self.password = self._hash_password(password)
        self.phone = phone
        self.role = role
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    @staticmethod
    def _hash_password(password):
        """Hash password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    @staticmethod
    def verify_password(stored_password, provided_password):
        """Verify password"""
        return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password.encode('utf-8'))

    def save(self):
        """Save user to database"""
        db = Database.get_db()
        user_data = {
            'name': self.name,
            'email': self.email,
            'password': self.password,
            'phone': self.phone,
            'role': self.role,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        result = db.users.insert_one(user_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        db = Database.get_db()
        normalized_email = email.strip().lower() if isinstance(email, str) else email
        return db.users.find_one({
            '$or': [
                {'email': normalized_email},
                {'email': {'$regex': f'^{re.escape(normalized_email)}$', '$options': 'i'}}
            ]
        })

    @staticmethod
    def find_by_phone(phone):
        """Find user by phone"""
        db = Database.get_db()
        normalized_phone = phone.strip() if isinstance(phone, str) else phone
        return db.users.find_one({'phone': normalized_phone})

    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        db = Database.get_db()
        return db.users.find_one({'_id': ObjectId(user_id)})
