from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.crop import Crop
from database import Database

crops_bp = Blueprint('crops', __name__)

# Initialize database
Database.initialize()

@crops_bp.route('/', methods=['GET'])
@jwt_required()
def get_crops():
    """Get all crops for the current user"""
    try:
        user_id = get_jwt_identity()
        crops = Crop.find_by_user(user_id)

        crops_list = []
        for crop in crops:
            crops_list.append({
                'id': str(crop['_id']),
                'name': crop['name'],
                'crop_type': crop['crop_type'],
                'area': crop['area'],
                'planting_date': crop['planting_date'],
                'expected_harvest_date': crop['expected_harvest_date'],
                'status': crop['status'],
                'created_at': crop['created_at']
            })

        return jsonify({'crops': crops_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crops_bp.route('/', methods=['POST'])
@jwt_required()
def add_crop():
    """Add a new crop"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Validate required fields
        if not data.get('name') or not data.get('crop_type'):
            return jsonify({'error': 'Name and crop type are required'}), 400

        # Create new crop
        crop = Crop(
            name=data['name'],
            user_id=user_id,
            crop_type=data['crop_type'],
            area=data.get('area', 0),
            planting_date=data.get('planting_date'),
            expected_harvest_date=data.get('expected_harvest_date'),
            status=data.get('status', 'planted')
        )

        crop_id = crop.save()

        return jsonify({
            'message': 'Crop added successfully',
            'crop_id': crop_id
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crops_bp.route('/<crop_id>', methods=['GET'])
@jwt_required()
def get_crop(crop_id):
    """Get a specific crop"""
    try:
        crop = Crop.find_by_id(crop_id)

        if not crop:
            return jsonify({'error': 'Crop not found'}), 404

        return jsonify({
            'crop': {
                'id': str(crop['_id']),
                'name': crop['name'],
                'crop_type': crop['crop_type'],
                'area': crop['area'],
                'planting_date': crop['planting_date'],
                'expected_harvest_date': crop['expected_harvest_date'],
                'status': crop['status']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crops_bp.route('/all', methods=['GET'])
def get_all_crops():
    """Get all crops (public endpoint)"""
    try:
        crops = Crop.find_all()

        crops_list = []
        for crop in crops:
            crops_list.append({
                'id': str(crop['_id']),
                'name': crop['name'],
                'crop_type': crop['crop_type'],
                'status': crop['status']
            })

        return jsonify({'crops': crops_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
