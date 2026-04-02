from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

def role_required(*allowed_roles):
    """
    Decorator to restrict routes to specific roles.
    Usage: @role_required('farmer', 'fpo', 'processor')
    """
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get('role')

            if user_role not in allowed_roles:
                return jsonify({
                    'error': f'Insufficient permissions. Required roles: {", ".join(allowed_roles)}'
                }), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator


def get_role_from_jwt():
    """
    Helper function to extract role from JWT claims.
    Must be called inside a @jwt_required() protected route.
    """
    claims = get_jwt()
    return claims.get('role', 'farmer')  # Default to 'farmer' if not set


def require_seller_role(fn):
    """
    Decorator to restrict routes to seller-type roles.
    Seller roles: farmer, fpo, shg, processor, startup
    """
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        user_role = claims.get('role')
        seller_roles = ['farmer', 'fpo', 'shg', 'processor', 'startup', 'admin']

        if user_role not in seller_roles:
            return jsonify({
                'error': 'This action is only available to sellers'
            }), 403

        return fn(*args, **kwargs)
    return wrapper


def require_buyer_role(fn):
    """
    Decorator to restrict routes to buyer-type roles.
    Currently only 'consumer' is a buyer role.
    """
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        user_role = claims.get('role')

        if user_role != 'consumer':
            return jsonify({
                'error': 'This action is only available to consumers'
            }), 403

        return fn(*args, **kwargs)
    return wrapper


def role_based_access(fn):
    """
    Decorator that passes role to the route handler.
    Usage: @role_based_access and then access it in the function.
    The decorated function should accept 'user_role' as first argument after normal args.
    """
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        user_role = claims.get('role', 'farmer')
        kwargs['user_role'] = user_role
        return fn(*args, **kwargs)
    return wrapper
