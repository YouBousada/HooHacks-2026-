from django.urls import path
from django.contrib.auth.decorators import login_required
from . import views

urlpatterns = [
    path('', login_required(views.EventListView.as_view()), name='event_list'),
    path('event/<int:pk>/', login_required(views.EventDetailView.as_view()), name='event_detail'),
    path('event/new/', login_required(views.EventCreateView.as_view()), name='event_create'),
    path('event/<int:pk>/edit/', login_required(views.EventUpdateView.as_view()), name='event_update'),
    path('event/<int:pk>/delete/', login_required(views.EventDeleteView.as_view()), name='event_delete'),
    # HooThere
    path('hoo/', views.hoo_view, name='hoo_view'),
    path('hoo/host/', views.hoo_host, name='hoo_host'),
    path('hoo/join/<int:event_id>/', views.hoo_join, name='hoo_join'),
    path('hoo/leave/<int:event_id>/', views.hoo_leave, name='hoo_leave'),
    path('hoo/edit/<int:event_id>/', views.hoo_edit, name='hoo_edit'),
    path('hoo/delete/<int:event_id>/', views.hoo_delete, name='hoo_delete'),
    path('hoo/events.json', views.hoo_events_json, name='hoo_events_json'),
]