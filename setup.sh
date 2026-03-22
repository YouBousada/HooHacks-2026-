#!/bin/bash
# Cville Scout — Mac/Linux Setup Script

echo "=== Cville Scout Setup ==="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed."
    echo "Install it from https://www.python.org/downloads/ or run: brew install python"
    exit 1
fi

echo "Python found: $(python3 --version)"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate
echo "Virtual environment activated."

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt --quiet

# Run migrations
echo "Running database migrations..."
python manage.py migrate

# Create superuser prompt
echo ""
echo "Do you want to create an admin superuser? (y/n)"
read -r answer
if [ "$answer" = "y" ]; then
    python manage.py createsuperuser
fi

echo ""
echo "=== Setup Complete! ==="
echo "Run ./run.sh to start the server"
