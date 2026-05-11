import os
from flask import Flask, render_template, send_from_directory
from flask_migrate import Migrate

from backend.config import config
from backend.models import db
from backend.routes import api_bp

def create_app(config_name=None):
    """Application factory"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__, 
                template_folder='../frontend/templates',
                static_folder='../frontend/static')
    
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)
    
    # Register blueprints
    app.register_blueprint(api_bp)
    
    # Register main route
    @app.route('/')
    def index():
        return render_template('index.html')

    # Favicon route
    @app.route('/favicon.ico')
    def favicon():
        return send_from_directory(os.path.join(app.root_path, '../frontend/static'), 'favicon.ico', mimetype='image/x-icon')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
