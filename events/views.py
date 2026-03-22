"""
Views for the events app.
"""
import re
from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.models import User
from django.urls import reverse_lazy
from django.contrib.auth import logout, login
from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib import messages
from .models import Event
from .forms import EventForm


class CustomLoginView(LoginView):
    """Custom login view — redirects to map after login."""
    template_name = 'login.html'
    redirect_authenticated_user = True
    success_url = reverse_lazy('map')          # ← now goes to map, not events


class SignupView(CreateView):
    """View for user signup with strong password validation."""
    model = User
    fields = ['username', 'email', 'password']
    template_name = 'signup.html'
    success_url = reverse_lazy('map')          # ← after signup go straight to map

    def form_valid(self, form):
        password = form.cleaned_data['password']

        # Strong password rules
        errors = []
        if len(password) < 8:
            errors.append('Password must be at least 8 characters.')
        if not re.search(r'[A-Z]', password):
            errors.append('Password must include at least one uppercase letter.')
        if not re.search(r'[a-z]', password):
            errors.append('Password must include at least one lowercase letter.')
        if not re.search(r'[0-9]', password):
            errors.append('Password must include at least one number.')
        if not re.search(r'[!@#$%^&*(),.?\":{}|<>_\-\+\=\[\]\/\\]', password):
            errors.append('Password must include at least one symbol (e.g. !, @, #).')

        if errors:
            for error in errors:
                form.add_error('password', error)
            return self.form_invalid(form)

        user = form.save(commit=False)
        user.set_password(password)
        user.save()

        # Auto-login after signup and go to map
        login(self.request, user)
        return redirect('map')


class CustomLogoutView(LogoutView):
    """Custom logout view."""
    next_page = reverse_lazy('login')
    http_method_names = ['get', 'post']

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            logout(request)
        return redirect(self.next_page)


class EventListView(ListView):
    model = Event
    template_name = 'events/event_list.html'
    context_object_name = 'events'
    paginate_by = 10


class EventDetailView(DetailView):
    model = Event
    template_name = 'events/event_detail.html'
    context_object_name = 'event'


class EventCreateView(CreateView):
    model = Event
    form_class = EventForm
    template_name = 'events/event_form.html'
    success_url = reverse_lazy('event_list')

    def form_valid(self, form):
        form.instance.creator = self.request.user
        return super().form_valid(form)


class EventUpdateView(UserPassesTestMixin, UpdateView):
    model = Event
    form_class = EventForm
    template_name = 'events/event_form.html'
    success_url = reverse_lazy('event_list')

    def test_func(self):
        event = self.get_object()
        return self.request.user == event.creator

    def handle_no_permission(self):
        return redirect('event_detail', pk=self.get_object().pk)


class EventDeleteView(UserPassesTestMixin, DeleteView):
    model = Event
    template_name = 'events/event_confirm_delete.html'
    success_url = reverse_lazy('event_list')

    def test_func(self):
        event = self.get_object()
        return self.request.user == event.creator

    def handle_no_permission(self):
        return redirect('event_detail', pk=self.get_object().pk)


def map_view(request):
    """Render the interactive Charlottesville map."""
    return render(request, 'map_view.html')
