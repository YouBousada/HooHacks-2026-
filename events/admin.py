"""
Django admin configuration for the events app.
"""
from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Admin interface for Event model."""
    list_display = ['name', 'time', 'address', 'created_at']
    list_filter = ['time', 'created_at']
    search_fields = ['name', 'description', 'address']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Event Information', {
            'fields': ('name', 'description', 'time', 'address')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
