"""
URL configuration for the events app.
"""
from django.urls import path
from django.contrib.auth.decorators import login_required
from . import views

urlpatterns = [
    path('', login_required(views.EventListView.as_view()), name='event_list'),
    path('event/<int:pk>/', login_required(views.EventDetailView.as_view()), name='event_detail'),
    path('event/new/', login_required(views.EventCreateView.as_view()), name='event_create'),
    path('event/<int:pk>/edit/', login_required(views.EventUpdateView.as_view()), name='event_update'),
    path('event/<int:pk>/delete/', login_required(views.EventDeleteView.as_view()), name='event_delete'),
]
