"""
Views for the events app.
"""
import re
import json
from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.models import User
from django.urls import reverse_lazy
from django.contrib.auth import logout, login
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from .models import HooEvent, HooAttendee


class CustomLoginView(LoginView):
    template_name = 'login.html'
    redirect_authenticated_user = True
    success_url = reverse_lazy('map')


class SignupView(CreateView):
    model = User
    fields = ['username', 'email', 'password']
    template_name = 'signup.html'
    success_url = reverse_lazy('map')

    def form_valid(self, form):
        password = form.cleaned_data['password']
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
        login(self.request, user)
        return redirect('map')


class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('login')
    http_method_names = ['get', 'post']

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            logout(request)
        return redirect(self.next_page)


# ── Map view ──────────────────────────────────────────────────────────────────
@login_required
def map_view(request):
    return render(request, 'map_view.html')


# ── HooThere views ────────────────────────────────────────────────────────────
@login_required
def hoo_view(request):
    """Main HooThere page — lists active hosted events."""
    hoo_events = HooEvent.objects.filter(is_active=True).prefetch_related('attendees')
    attending_ids = set(
        HooAttendee.objects.filter(user=request.user).values_list('event_id', flat=True)
    )
    # Build JSON for map pins
    events_data = []
    for e in hoo_events:
        events_data.append({
            'id': e.id, 'host': e.host.username,
            'location_name': e.location_name, 'address': e.address,
            'lat': e.lat, 'lng': e.lng,
            'description': e.description,
            'max_attendees': e.max_attendees,
            'attendee_count': e.attendees.count(),
            'contact_info': e.contact_info,
        })
    import json
    return render(request, 'hoo_view.html', {
        'hoo_events': hoo_events,
        'attending_ids': attending_ids,
        'hoo_events_json': json.dumps(events_data),
        'attending_ids_json': json.dumps(list(attending_ids)),
    })


@login_required
def hoo_host(request):
    """Create a new hosted HooEvent."""
    if request.method == 'POST':
        location_name = request.POST.get('location_name', '').strip()
        address = request.POST.get('address', '').strip()
        lat = request.POST.get('lat', '')
        lng = request.POST.get('lng', '')
        description = request.POST.get('description', '').strip()
        max_attendees = request.POST.get('max_attendees', '').strip()
        contact_info = request.POST.get('contact_info', '').strip()

        errors = []
        if not location_name: errors.append('Please enter a location name.')
        if not description:   errors.append('Please add a description.')
        if not contact_info:  errors.append('Please add your contact info.')
        if not max_attendees or not max_attendees.isdigit():
            errors.append('Please enter a valid number of attendees.')

        if errors:
            return render(request, 'hoo_host.html', {'errors': errors, 'post': request.POST})

        HooEvent.objects.create(
            host=request.user,
            location_name=location_name,
            address=address,
            lat=float(lat) if lat else 38.0293,
            lng=float(lng) if lng else -78.4767,
            description=description,
            max_attendees=int(max_attendees),
            contact_info=contact_info,
        )
        return redirect('hoo_view')

    return render(request, 'hoo_host.html', {'errors': [], 'post': {}})


@login_required
@require_POST
def hoo_join(request, event_id):
    """Mark interest in attending a HooEvent."""
    event = get_object_or_404(HooEvent, id=event_id, is_active=True)
    if event.host == request.user:
        return redirect('hoo_view')

    attendee_count = event.attendees.count()
    if attendee_count >= event.max_attendees:
        return redirect('hoo_view')

    HooAttendee.objects.get_or_create(event=event, user=request.user)
    return redirect('hoo_view')


@login_required
@require_POST
def hoo_leave(request, event_id):
    """Allow a visitor to opt out of a HooEvent."""
    event = get_object_or_404(HooEvent, id=event_id)
    if event.host == request.user:
        # Host can't leave their own event — redirect back with no change
        return redirect('hoo_view')
    # Delete the attendee record regardless — if it doesn't exist, that's fine too
    HooAttendee.objects.filter(event=event, user=request.user).delete()
    return redirect('hoo_view')


@login_required
def hoo_edit(request, event_id):
    """Allow the host to edit their HooEvent."""
    event = get_object_or_404(HooEvent, id=event_id)
    if event.host != request.user:
        return redirect('hoo_view')

    errors = []
    if request.method == 'POST':
        location_name = request.POST.get('location_name', '').strip()
        address = request.POST.get('address', '').strip()
        lat = request.POST.get('lat', '')
        lng = request.POST.get('lng', '')
        description = request.POST.get('description', '').strip()
        max_attendees = request.POST.get('max_attendees', '').strip()
        contact_info = request.POST.get('contact_info', '').strip()

        if not location_name: errors.append('Please enter a location name.')
        if not description:   errors.append('Please add a description.')
        if not contact_info:  errors.append('Please add your contact info.')
        if not max_attendees or not max_attendees.isdigit():
            errors.append('Please enter a valid number of attendees.')

        if not errors:
            event.location_name = location_name
            event.address = address
            event.lat = float(lat) if lat else event.lat
            event.lng = float(lng) if lng else event.lng
            event.description = description
            event.max_attendees = int(max_attendees)
            event.contact_info = contact_info
            event.save()
            return redirect('hoo_view')

    return render(request, 'hoo_edit.html', {'event': event, 'errors': errors})


@login_required
@require_POST
def hoo_delete(request, event_id):
    """Allow the host to delete their HooEvent."""
    event = get_object_or_404(HooEvent, id=event_id)
    if event.host == request.user:
        event.delete()
    return redirect('hoo_view')


@login_required
def hoo_events_json(request):
    """Return all active HooEvents as JSON for map pins."""
    events = HooEvent.objects.filter(is_active=True).prefetch_related('attendees')
    data = []
    for e in events:
        data.append({
            'id': e.id,
            'host': e.host.username,
            'location_name': e.location_name,
            'address': e.address,
            'lat': e.lat,
            'lng': e.lng,
            'description': e.description,
            'max_attendees': e.max_attendees,
            'attendee_count': e.attendees.count(),
            'contact_info': e.contact_info,
        })
    return JsonResponse({'events': data})