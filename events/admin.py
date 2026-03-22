"""
Django admin configuration for the events app.
"""
from django.contrib import admin
from .models import HooEvent, HooAttendee


@admin.register(HooEvent)
class HooEventAdmin(admin.ModelAdmin):
    """Admin interface for HooEvent model."""
    list_display = ['location_name', 'host', 'lat', 'lng', 'max_attendees', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'host']
    search_fields = ['location_name', 'address', 'description', 'host__username', 'contact_info']
    readonly_fields = ['created_at']
    fieldsets = (
        ('Event Details', {
            'fields': ('host', 'location_name', 'address', 'lat', 'lng', 'description', 'max_attendees', 'contact_info')
        }),
        ('Status', {
            'fields': ('is_active', 'created_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(HooAttendee)
class HooAttendeeAdmin(admin.ModelAdmin):
    """Admin interface for HooAttendee model."""
    list_display = ['event', 'user', 'joined_at']
    list_filter = ['joined_at', 'event', 'user']
    search_fields = ['event__location_name', 'user__username']
    readonly_fields = ['joined_at']
    fieldsets = (
        ('Attendance Info', {
            'fields': ('event', 'user', 'joined_at')
        }),
    )
