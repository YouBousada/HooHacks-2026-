# Django Events Manager

A basic Django web application for managing events with name, time, and description.

## Features

- 📅 **Create Events** - Add new events with name, description, and time
- 🔍 **View Events** - Browse all events in a beautiful card layout
- ✏️ **Edit Events** - Update event details
- 🗑️ **Delete Events** - Remove events you no longer need
- 📱 **Responsive Design** - Works great on mobile and desktop with Bootstrap 5
- ⚙️ **Django Admin** - Manage events through Django's admin interface

## Project Structure

```
HooHacks-2026-/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── event_site/              # Main project configuration
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL routing
│   └── wsgi.py              # WSGI application
├── events/                  # Events app
│   ├── models.py            # Event model definition
│   ├── views.py             # View logic
│   ├── forms.py             # Event form
│   ├── urls.py              # Events URL routing
│   └── admin.py             # Admin interface
└── templates/               # HTML templates
    ├── base.html            # Base template
    └── events/              # Event templates
        ├── event_list.html
        ├── event_detail.html
        ├── event_form.html
        └── event_confirm_delete.html
```

## Quickstart

### 1. Install Dependencies

```bash
# Activate your virtual environment (if using one)
venv\Scripts\activate

# Install Django
pip install -r requirements.txt
```

### 2. Set Up the Database

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Create a Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### 4. Run the Development Server

```bash
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000/`

### 5. Access the Application

- **Main App**: http://127.0.0.1:8000/
- **Admin Panel**: http://127.0.0.1:8000/admin/

## Event Model

The Event model has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| name | CharField | Event name (max 200 chars) |
| description | TextField | Detailed event description (optional) |
| time | DateTimeField | Event date and time |
| created_at | DateTimeField | Auto-set creation timestamp |
| updated_at | DateTimeField | Auto-updated modification timestamp |

## Available Views

- **Event List** (`/`) - Display all events
- **Event Detail** (`/event/<id>/`) - View full event details
- **Create Event** (`/event/new/`) - Create a new event
- **Edit Event** (`/event/<id>/edit/`) - Edit an existing event
- **Delete Event** (`/event/<id>/delete/`) - Delete an event

## API Endpoints

All endpoints are accessible through the web interface. URL patterns are defined in:
- Main URLs: `event_site/urls.py`
- App URLs: `events/urls.py`

## Admin Interface

Access the Django admin at `/admin/` with your superuser credentials to:
- Manage events
- Filter events by date
- Search events by name or description
- View metadata about events

## Customization

### Adding New Fields to Event Model

Edit `events/models.py` and add the field:

```python
class Event(models.Model):
    # ... existing fields
    location = models.CharField(max_length=200, blank=True)
```

Then run:
```bash
python manage.py makemigrations
python manage.py migrate
```

Update the form in `events/forms.py` to include the new field in the `fields` list.

### Styling

The application uses Bootstrap 5. Modify templates in `templates/` to customize styling.

## Troubleshooting

### Port Already in Use
If port 8000 is already in use:
```bash
python manage.py runserver 8001
```

### Database Errors
Reset the database:
```bash
# Delete db.sqlite3 if it exists
python manage.py migrate
```

### Missing Migrations
Recreate migrations:
```bash
python manage.py makemigrations events
python manage.py migrate
```

## Next Steps

- Add user authentication to restrict event creation
- Implement event categories or tags
- Add recurring events support
- Create an API with Django REST Framework
- Deploy to a production server
- Add email notifications for upcoming events

## License

See LICENSE.md for details.

