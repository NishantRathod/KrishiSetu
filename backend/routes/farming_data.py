from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.farming_data import FarmingData
from database import Database

farming_data_bp = Blueprint('farming_data', __name__)

# Initialize database
Database.initialize()


def serialize_record(record):
    return {
        'id': str(record['_id']),
        'user_id': record.get('user_id'),
        'crop_name': record.get('crop_name'),
        'crop_type': record.get('crop_type'),
        'land_area': record.get('land_area'),
        'land_unit': record.get('land_unit'),
        'season': record.get('season'),
        'soil_type': record.get('soil_type'),
        'irrigation_type': record.get('irrigation_type'),
        'sowing_date': record.get('sowing_date'),
        'expected_harvest_date': record.get('expected_harvest_date'),
        'fertilizer_used': record.get('fertilizer_used'),
        'pesticide_used': record.get('pesticide_used'),
        'yield_estimate': record.get('yield_estimate'),
        'yield_unit': record.get('yield_unit'),
        'expenses': record.get('expenses'),
        'location': record.get('location'),
        'notes': record.get('notes'),
        'status': record.get('status'),
        'created_at': record.get('created_at'),
        'updated_at': record.get('updated_at')
    }


@farming_data_bp.route('/', methods=['GET'])
@jwt_required()
def get_farming_data():
    """Get farming data records for the current user"""
    try:
        user_id = get_jwt_identity()
        records = FarmingData.find_by_user(user_id)

        return jsonify({
            'farming_data': [serialize_record(record) for record in records]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@farming_data_bp.route('/', methods=['POST'])
@jwt_required()
def add_farming_data():
    """Add a farming data record"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}

        if not data.get('crop_name') or not data.get('crop_type'):
            return jsonify({'error': 'Crop name and crop type are required'}), 400

        record = FarmingData(
            user_id=user_id,
            crop_name=data['crop_name'],
            crop_type=data['crop_type'],
            land_area=data.get('land_area'),
            land_unit=data.get('land_unit', 'acres'),
            season=data.get('season'),
            soil_type=data.get('soil_type'),
            irrigation_type=data.get('irrigation_type'),
            sowing_date=data.get('sowing_date'),
            expected_harvest_date=data.get('expected_harvest_date'),
            fertilizer_used=data.get('fertilizer_used'),
            pesticide_used=data.get('pesticide_used'),
            yield_estimate=data.get('yield_estimate'),
            yield_unit=data.get('yield_unit', 'quintal'),
            expenses=data.get('expenses'),
            location=data.get('location'),
            notes=data.get('notes'),
            status=data.get('status', 'active')
        )

        record_id = record.save()

        return jsonify({
            'message': 'Farming data saved successfully',
            'farming_data_id': record_id
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@farming_data_bp.route('/<record_id>', methods=['GET'])
@jwt_required()
def get_farming_data_record(record_id):
    """Get a specific farming data record"""
    try:
        record = FarmingData.find_by_id(record_id)

        if not record:
            return jsonify({'error': 'Farming data record not found'}), 404

        return jsonify({'farming_data': serialize_record(record)}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@farming_data_bp.route('/<record_id>', methods=['PUT'])
@jwt_required()
def update_farming_data_record(record_id):
    """Update a farming data record"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}
        record = FarmingData.find_by_id(record_id)

        if not record:
            return jsonify({'error': 'Farming data record not found'}), 404

        if record.get('user_id') != user_id:
            return jsonify({'error': 'Unauthorized'}), 403

        allowed_fields = [
            'crop_name', 'crop_type', 'land_area', 'land_unit', 'season',
            'soil_type', 'irrigation_type', 'sowing_date', 'expected_harvest_date',
            'fertilizer_used', 'pesticide_used', 'yield_estimate', 'yield_unit',
            'expenses', 'location', 'notes', 'status'
        ]

        update_data = {field: data[field] for field in allowed_fields if field in data}

        if not update_data:
            return jsonify({'error': 'No data to update'}), 400

        FarmingData.update_by_id(record_id, update_data)

        return jsonify({'message': 'Farming data updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@farming_data_bp.route('/<record_id>', methods=['DELETE'])
@jwt_required()
def delete_farming_data_record(record_id):
    """Delete a farming data record"""
    try:
        user_id = get_jwt_identity()
        record = FarmingData.find_by_id(record_id)

        if not record:
            return jsonify({'error': 'Farming data record not found'}), 404

        if record.get('user_id') != user_id:
            return jsonify({'error': 'Unauthorized'}), 403

        FarmingData.delete_by_id(record_id)

        return jsonify({'message': 'Farming data deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500