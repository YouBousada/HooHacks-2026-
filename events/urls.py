from django.urls import path
from django.contrib.auth.decorators import login_required
from . import views

urlpatterns = [
    path('', views.hoo_view, name='hoo_view'),
    path('host/', views.hoo_host, name='hoo_host'),
    path('join/<int:event_id>/', views.hoo_join, name='hoo_join'),
    path('leave/<int:event_id>/', views.hoo_leave, name='hoo_leave'),
    path('edit/<int:event_id>/', views.hoo_edit, name='hoo_edit'),
    path('delete/<int:event_id>/', views.hoo_delete, name='hoo_delete'),
    path('events.json', views.hoo_events_json, name='hoo_events_json'),
]