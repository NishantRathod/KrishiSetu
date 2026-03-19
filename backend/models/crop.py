from datetime import datetime
from database import Database

class Crop:
    """Crop model"""

    def __init__(self, name, user_id, crop_type, area, planting_date, expected_harvest_date, status='planted'):
        self.name = name
        self.user_id = user_id
        self.crop_type = crop_type
        self.area = area  # in acres or hectares
        self.planting_date = planting_date
        self.expected_harvest_date = expected_harvest_date
        self.status = status
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        """Save crop to database"""
        db = Database.get_db()
        crop_data = {
            'name': self.name,
            'user_id': self.user_id,
            'crop_type': self.crop_type,
            'area': self.area,
            'planting_date': self.planting_date,
            'expected_harvest_date': self.expected_harvest_date,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        result = db.crops.insert_one(crop_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_user(user_id):
        """Find crops by user ID"""
        db = Database.get_db()
        return list(db.crops.find({'user_id': user_id}))

    @staticmethod
    def find_all():
        """Find all crops"""
        db = Database.get_db()
        return list(db.crops.find())

    @staticmethod
    def find_by_id(crop_id):
        """Find crop by ID"""
        from bson import ObjectId
        db = Database.get_db()
        return db.crops.find_one({'_id': ObjectId(crop_id)})
