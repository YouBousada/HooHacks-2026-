"""
Forms for the events app.
"""
from django import forms
from .models import Event


class EventForm(forms.ModelForm):
    """Form for creating and updating events."""
    class Meta:
        model = Event
        fields = ['name', 'description', 'time', 'address']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Event name'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Event description',
                'rows': 4
            }),
            'time': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'address': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Event address'
            }),
        }
