"""
Views for the events app.
"""
from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.models import User
from django.urls import reverse_lazy
from django.contrib.auth import logout
from .models import Event
from .forms import EventForm


class CustomLoginView(LoginView):
    """Custom login view."""
    template_name = 'login.html'
    redirect_authenticated_user = True
    success_url = reverse_lazy('event_list')


class SignupView(CreateView):
    """View for user signup."""
    model = User
    fields = ['username', 'email', 'password']
    template_name = 'signup.html'
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        user = form.save(commit=False)
        user.set_password(form.cleaned_data['password'])
        user.save()
        return super().form_valid(form)


class CustomLogoutView(LogoutView):
    """Custom logout view."""
    next_page = reverse_lazy('login')
    http_method_names = ['get', 'post']
    
    def dispatch(self, request, *args, **kwargs):
        """Ensure session is properly cleared before logout."""
        if request.user.is_authenticated:
            logout(request)
        return redirect(self.next_page)


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
