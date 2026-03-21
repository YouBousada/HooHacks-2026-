"""
URL configuration for event_site project.
"""
from django.contrib import admin
from django.urls import path, include
from events.views import CustomLoginView, SignupView, CustomLogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', CustomLoginView.as_view(), name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    path('events/', include('events.urls')),
]
