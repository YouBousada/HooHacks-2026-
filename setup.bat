@echo off
REM Setup script for Django Events Manager
REM This script sets up the Django application on Windows

echo.
echo ====================================
echo Django Events Manager Setup
echo ====================================
echo.

REM Check if venv exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Create a superuser: python manage.py createsuperuser
echo 2. Run the server: python manage.py runserver
echo 3. Visit http://127.0.0.1:8000/ in your browser
echo.
pause
