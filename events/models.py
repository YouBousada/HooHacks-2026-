"""
Models for the events app.
"""
from django.db import models


class Event(models.Model):
    """Model representing an event."""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    address = models.CharField(
        max_length=300,
        blank=True,  # Optional field
        help_text="Event location address"
    )

    class Meta:
        ordering = ['time']

    def __str__(self):
        return self.name
