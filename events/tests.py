"""
Unit tests for the events app.
"""
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from .models import Event


class EventModelTest(TestCase):
    """Test cases for the Event model."""

    def setUp(self):
        """Set up test data."""
        self.event = Event.objects.create(
            name="Test Event",
            description="This is a test event",
            time=timezone.now()
        )

    def test_event_creation(self):
        """Test that an event can be created."""
        self.assertEqual(self.event.name, "Test Event")
        self.assertEqual(self.event.description, "This is a test event")

    def test_event_str(self):
        """Test the string representation of an event."""
        self.assertEqual(str(self.event), "Test Event")


class EventViewTest(TestCase):
    """Test cases for Event views."""

    def setUp(self):
        """Set up test data."""
        self.event = Event.objects.create(
            name="Test Event",
            time=timezone.now()
        )

    def test_event_list_view(self):
        """Test the event list view."""
        response = self.client.get(reverse('event_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test Event")

    def test_event_detail_view(self):
        """Test the event detail view."""
        response = self.client.get(reverse('event_detail', args=[self.event.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test Event")

    def test_event_create_view(self):
        """Test creating a new event."""
        response = self.client.get(reverse('event_create'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "New Event")
