from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models.product import Product
from database import Database
from bson import ObjectId
from datetime import datetime

marketplace_bp = Blueprint('marketplace', __name__)

# Initialize database
Database.initialize()

@marketplace_bp.route('/products', methods=['GET'])
def get_products():
    """Get all products"""
    try:
        category = request.args.get('category')

        if category:
            products = Product.find_by_category(category)
        else:
            products = Product.find_all()

        products_list = []
        for product in products:
            products_list.append({
                'id': str(product['_id']),
                'title': product['title'],
                'description': product['description'],
                'price': product['price'],
                'category': product['category'],
                'quantity': product['quantity'],
                'unit': product['unit'],
                'images': product.get('images', []),
                'created_at': product['created_at']
            })

        return jsonify({'products': products_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@marketplace_bp.route('/products', methods=['POST'])
@jwt_required()
def add_product():
    """Add a new product to marketplace (seller roles only)"""
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        user_role = claims.get('role', 'farmer')
        data = request.get_json()

        # Only seller-type roles can add products
        seller_roles = ['farmer', 'fpo', 'shg', 'processor', 'startup', 'admin']
        if user_role not in seller_roles:
            return jsonify({'error': 'Only sellers can add products. Consumer role cannot list products'}), 403

        # Validate required fields
        required_fields = ['title', 'description', 'price', 'category', 'quantity', 'unit']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Create new product
        product = Product(
            title=data['title'],
            description=data['description'],
            price=float(data['price']),
            category=data['category'],
            seller_id=user_id,
            quantity=float(data['quantity']),
            unit=data['unit'],
            images=data.get('images', [])
        )

        product_id = product.save()

        return jsonify({
            'message': 'Product added successfully',
            'product_id': product_id
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@marketplace_bp.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get a specific product"""
    try:
        product = Product.find_by_id(product_id)

        if not product:
            return jsonify({'error': 'Product not found'}), 404

        return jsonify({
            'product': {
                'id': str(product['_id']),
                'title': product['title'],
                'description': product['description'],
                'price': product['price'],
                'category': product['category'],
                'quantity': product['quantity'],
                'unit': product['unit'],
                'images': product.get('images', []),
                'seller_id': product['seller_id'],
                'status': product['status']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@marketplace_bp.route('/my-products', methods=['GET'])
@jwt_required()
def get_my_products():
    """Get all products listed by current user (seller roles only)"""
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        user_role = claims.get('role', 'farmer')

        # Only seller-type roles can have product listings
        seller_roles = ['farmer', 'fpo', 'shg', 'processor', 'startup', 'admin']
        if user_role not in seller_roles:
            return jsonify({'error': 'Only sellers can view product listings. Consumer role cannot list products'}), 403

        products = Product.find_by_seller(user_id)

        products_list = []
        for product in products:
            products_list.append({
                'id': str(product['_id']),
                'title': product['title'],
                'description': product['description'],
                'price': product['price'],
                'category': product['category'],
                'quantity': product['quantity'],
                'unit': product['unit'],
                'status': product['status']
            })

        return jsonify({'products': products_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@marketplace_bp.route('/products/<product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Update a product (seller roles only)"""
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        user_role = claims.get('role', 'farmer')
        data = request.get_json()
        db = Database.get_db()

        # Only seller-type roles can update products
        seller_roles = ['farmer', 'fpo', 'shg', 'processor', 'startup', 'admin']
        if user_role not in seller_roles:
            return jsonify({'error': 'Only sellers can update products'}), 403

        # Check if product exists and belongs to user
        product = Product.find_by_id(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        if product['seller_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403

        # Update allowed fields
        update_data = {}
        if 'title' in data:
            update_data['title'] = data['title']
        if 'description' in data:
            update_data['description'] = data['description']
        if 'price' in data:
            update_data['price'] = float(data['price'])
        if 'quantity' in data:
            update_data['quantity'] = float(data['quantity'])
        if 'unit' in data:
            update_data['unit'] = data['unit']
        if 'category' in data:
            update_data['category'] = data['category']
        if 'status' in data:
            update_data['status'] = data['status']

        if update_data:
            update_data['updated_at'] = datetime.utcnow()
            db.products.update_one(
                {'_id': ObjectId(product_id)},
                {'$set': update_data}
            )
            return jsonify({'message': 'Product updated successfully'}), 200
        else:
            return jsonify({'error': 'No data to update'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@marketplace_bp.route('/products/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Delete a product (seller roles only)"""
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        user_role = claims.get('role', 'farmer')
        db = Database.get_db()

        # Only seller-type roles can delete products
        seller_roles = ['farmer', 'fpo', 'shg', 'processor', 'startup', 'admin']
        if user_role not in seller_roles:
            return jsonify({'error': 'Only sellers can delete products'}), 403

        # Check if product exists and belongs to user
        product = Product.find_by_id(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        if product['seller_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403

        # Delete the product
        db.products.delete_one({'_id': ObjectId(product_id)})

        return jsonify({'message': 'Product deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

