from datetime import datetime
from database import Database
import bcrypt

class User:
    """User model"""

    def __init__(self, name, email, password, phone=None, role='farmer'):
        self.name = name
        self.email = email
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
        return db.users.find_one({'email': email})

    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        from bson import ObjectId
        db = Database.get_db()
        return db.users.find_one({'_id': ObjectId(user_id)})
