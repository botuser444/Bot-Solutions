"""
URLs for the website app. The main page lives at the root URL.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
