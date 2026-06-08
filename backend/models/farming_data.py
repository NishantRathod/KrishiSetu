from datetime import datetime
from database import Database
from bson import ObjectId


class FarmingData:
    """Farming data model for crop and farm records"""

    def __init__(
        self,
        user_id,
        crop_name,
        crop_type,
        land_area=None,
        land_unit='acres',
        season=None,
        soil_type=None,
        irrigation_type=None,
        sowing_date=None,
        expected_harvest_date=None,
        fertilizer_used=None,
        pesticide_used=None,
        yield_estimate=None,
        yield_unit='quintal',
        expenses=None,
        location=None,
        notes=None,
        status='active'
    ):
        self.user_id = user_id
        self.crop_name = crop_name
        self.crop_type = crop_type
        self.land_area = land_area
        self.land_unit = land_unit
        self.season = season
        self.soil_type = soil_type
        self.irrigation_type = irrigation_type
        self.sowing_date = sowing_date
        self.expected_harvest_date = expected_harvest_date
        self.fertilizer_used = fertilizer_used
        self.pesticide_used = pesticide_used
        self.yield_estimate = yield_estimate
        self.yield_unit = yield_unit
        self.expenses = expenses
        self.location = location
        self.notes = notes
        self.status = status
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        """Save farming data to database"""
        db = Database.get_db()
        record = {
            'user_id': self.user_id,
            'crop_name': self.crop_name,
            'crop_type': self.crop_type,
            'land_area': self.land_area,
            'land_unit': self.land_unit,
            'season': self.season,
            'soil_type': self.soil_type,
            'irrigation_type': self.irrigation_type,
            'sowing_date': self.sowing_date,
            'expected_harvest_date': self.expected_harvest_date,
            'fertilizer_used': self.fertilizer_used,
            'pesticide_used': self.pesticide_used,
            'yield_estimate': self.yield_estimate,
            'yield_unit': self.yield_unit,
            'expenses': self.expenses,
            'location': self.location,
            'notes': self.notes,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        result = db.farming_data.insert_one(record)
        return str(result.inserted_id)

    @staticmethod
    def find_by_user(user_id):
        """Find farming data by user ID"""
        db = Database.get_db()
        return list(db.farming_data.find({'user_id': user_id}).sort('created_at', -1))

    @staticmethod
    def find_by_id(record_id):
        """Find farming data record by ID"""
        db = Database.get_db()
        return db.farming_data.find_one({'_id': ObjectId(record_id)})

    @staticmethod
    def update_by_id(record_id, update_data):
        """Update farming data record"""
        db = Database.get_db()
        update_payload = {**update_data, 'updated_at': datetime.utcnow()}
        db.farming_data.update_one(
            {'_id': ObjectId(record_id)},
            {'$set': update_payload}
        )

    @staticmethod
    def delete_by_id(record_id):
        """Delete farming data record"""
        db = Database.get_db()
        db.farming_data.delete_one({'_id': ObjectId(record_id)})