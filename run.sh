#!/bin/bash
# Cville Scout — Mac/Linux Run Script

source venv/bin/activate
echo "Starting Cville Scout..."
echo "Open http://127.0.0.1:8000/ in your browser"
echo "Press Ctrl+C to stop"
echo ""
python manage.py runserver
