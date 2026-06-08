"""
WSGI entry point for production deployment
Used by Gunicorn, uWSGI, and other WSGI servers
"""
import os
from app import create_app

# Set Flask environment to production by default
os.environ.setdefault('FLASK_ENV', 'production')

# Create the application
app = create_app('production')

if __name__ == '__main__':
    app.run()
