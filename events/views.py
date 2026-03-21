"""
Views for the events app.
"""
from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from .models import Event
from .forms import EventForm


class EventListView(ListView):
    """View to list all events."""
    model = Event
    template_name = 'events/event_list.html'
    context_object_name = 'events'
    paginate_by = 10


class EventDetailView(DetailView):
    """View to display a single event."""
    model = Event
    template_name = 'events/event_detail.html'
    context_object_name = 'event'


class EventCreateView(CreateView):
    """View to create a new event."""
    model = Event
    form_class = EventForm
    template_name = 'events/event_form.html'
    success_url = reverse_lazy('event_list')


class EventUpdateView(UpdateView):
    """View to update an existing event."""
    model = Event
    form_class = EventForm
    template_name = 'events/event_form.html'
    success_url = reverse_lazy('event_list')


class EventDeleteView(DeleteView):
    """View to delete an event."""
    model = Event
    template_name = 'events/event_confirm_delete.html'
    success_url = reverse_lazy('event_list')
