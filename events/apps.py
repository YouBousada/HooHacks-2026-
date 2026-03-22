"""
Application configuration for the events app.
"""
from django.apps import AppConfig


class EventsConfig(AppConfig):
    """Configuration class for the events app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'events'
