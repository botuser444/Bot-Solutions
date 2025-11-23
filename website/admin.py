"""
Register models with Django admin so submissions can be viewed.
"""
from django.contrib import admin
from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'date')
    search_fields = ('name', 'email', 'message')
