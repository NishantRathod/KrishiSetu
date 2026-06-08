from flask import Flask, jsonify, send_from_directory, render_template
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
import os

def create_app(config_name='default'):
    """Application factory pattern"""
    # Configure Flask to use templates and static folders from parent directories
    app = Flask(__name__, 
                static_folder=os.path.join(os.path.dirname(__file__), '..', 'frontend'),
                static_url_path='',
                template_folder=os.path.join(os.path.dirname(__file__), '..', 'frontend'))

    # Load configuration
    app.config.from_object(config[config_name])

    # Initialize extensions
    CORS(app)
    jwt = JWTManager(app)

    # Register blueprints
    from routes.auth import auth_bp
    from routes.crops import crops_bp
    from routes.marketplace import marketplace_bp
    from routes.users import users_bp
    from routes.dashboard import dashboard_bp
    from routes.orders import orders_bp
    from routes.farming_data import farming_data_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(crops_bp, url_prefix='/api/crops')
    app.register_blueprint(marketplace_bp, url_prefix='/api/marketplace')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(farming_data_bp, url_prefix='/api/farming-data')

    # Serve frontend index.html
    @app.route('/')
    def index():
        return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'frontend'), 'index.html')

    # Serve other HTML pages
    @app.route('/<path:filename>')
    def serve_pages(filename):
        # Check if file exists in frontend folder
        frontend_path = os.path.join(os.path.dirname(__file__), '..', 'frontend')
        file_path = os.path.join(frontend_path, filename)
        
        # If it's an HTML file, serve it
        if os.path.isfile(file_path) and filename.endswith('.html'):
            return send_from_directory(frontend_path, filename)
        
        # If it's a CSS or JS file, serve it
        if os.path.isfile(file_path) and (filename.endswith('.css') or filename.endswith('.js')):
            return send_from_directory(frontend_path, filename)
        
        # Otherwise return 404
        return jsonify({'error': 'File not found'}), 404

    # API root route  
    @app.route('/api')
    def api_home():
        return jsonify({
            'message': 'Welcome to KrishiSetu API',
            'version': '1.0.0',
            'status': 'Server is running',
            'endpoints': {
                'auth': '/api/auth',
                'crops': '/api/crops',
                'marketplace': '/api/marketplace',
                'users': '/api/users',
                'dashboard': '/api/dashboard',
                'orders': '/api/orders',
                'farming_data': '/api/farming-data'
            }
        })

    # Health check route
    @app.route('/health')
    def health():
        return jsonify({'status': 'healthy'})

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    return app

if __name__ == '__main__':
    env = os.getenv('FLASK_ENV', 'development')
    app = create_app(env)
    app.run(
        host='0.0.0.0',
        port=app.config['PORT'],
        debug=app.config['DEBUG']
    )
