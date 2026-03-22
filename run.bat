@echo off
REM Quick run script for the Django development server
REM Usage: run.bat [port]

setlocal enabledelayedexpansion

if "%1"=="" (
    set PORT=8000
) else (
    set PORT=%1
)

echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Starting Django development server on port !PORT!...
python manage.py runserver !PORT!

pause
