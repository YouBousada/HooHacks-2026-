"""
Models for the events app.
"""
from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    """Original event model."""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    address = models.CharField(max_length=300, blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, default=1)

    class Meta:
        ordering = ['time']

    def __str__(self):
        return self.name


class HooEvent(models.Model):
    """A hosted hangout event created by a user at a specific location."""
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hoo_events')
    location_name = models.CharField(max_length=200, help_text="Name of the spot")
    address = models.CharField(max_length=300, help_text="Address of the spot")
    lat = models.FloatField(help_text="Latitude")
    lng = models.FloatField(help_text="Longitude")
    description = models.TextField(help_text="What's the vibe? What are you planning?")
    max_attendees = models.PositiveIntegerField(help_text="Max number of people")
    contact_info = models.CharField(max_length=200, help_text="How can people reach you? (Instagram, phone, etc.)")
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.host.username} @ {self.location_name}"


class HooAttendee(models.Model):
    """Tracks who is interested in attending a HooEvent."""
    event = models.ForeignKey(HooEvent, on_delete=models.CASCADE, related_name='attendees')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')

    def __str__(self):
        return f"{self.user.username} → {self.event.location_name}"
