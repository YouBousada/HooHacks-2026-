# HooThere

This repository is a Django-based location and event discovery app built for Charlottesville, with two main experiences:

1. **HooThere** – community-hosted meetups and hangouts (host + join flows)
2. **WhatThere** – interactive map of local places and hidden gems (dynamic, admin-managed locations)

## Core Features

- ✅ User authentication (login/signup/logout)
- ✅ User profile home/offers
- ✅ HooEvent hosting (create/edit/delete by host)
- ✅ Joining/leaving HooEvents, attendee limits
- ✅ HooAttendee tracking
- ✅ PlaceSuggestion model for user-submitted location ideas
- ✅ Location model with full admin CRUD
- ✅ Leaflet map UI with category filtering and marker popups
- ✅ Original 65 locations imported from hardcoded dataset
- ✅ Postgres-ready DB config with env var fallback to SQLite

## Project Structure

```
HooHacks-2026-/
├── manage.py
├── requirements.txt
├── LICENSE.md
├── README.md
├── event_site/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── events/
│   ├── admin.py
│   ├── apps.py
│   ├── forms.py
│   ├── migrations/
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── templates/
│   ├── login.html
│   ├── signup.html
│   ├── map_view.html
│   ├── hoo_view.html
│   ├── hoo_host.html
│   ├── hoo_edit.html
│   └── ...
└── static/
    ├── css/style.css
    └── js/map.js
```

## Setup (local dev)

1. Create and activate virtual environment

```bash
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies

```bash
pip install -r requirements.txt
````

3. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

4. Create superuser

```bash
python manage.py createsuperuser
```

5. Start server

```bash
python manage.py runserver
```

6. Visit app
- `http://127.0.0.1:8000/` (map + events)
- `http://127.0.0.1:8000/admin/` (admin models)

## Models

- `HooEvent` (hosted events)
- `HooAttendee` (event attendees)
- `PlaceSuggestion` (user suggestions for new locations)
- `Location` (seeded 65 entries + admin-managed discovery data)

## Views

- `map_view` – map / WhatThere UI
- `hoo_view` – HooThere events feed
- `hoo_host` – host event form
- `hoo_edit`, `hoo_delete` – manage hosted events
- `hoo_join`, `hoo_leave` – manage attendance
- `hoo_events_json` – JSON API for event pins

## Map data flow

`map_view` serves category/marker data from `Location.objects.filter(is_active=True)` as JSON, then `static/js/map.js` renders Leaflet markers.

## Security

- Remove hardcoded API secrets from templates (now using Leaflet base tiles)
- Keep sensitive values in env vars (`DJANGO_DB_*`, plus API keys when used)

## Licensing

This project is licensed under MIT. See [LICENSE.md](LICENSE.md).

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

