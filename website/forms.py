"""
Simple form using Django's ModelForm for the Contact model.
"""
from django import forms
from .models import Contact


class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ['name', 'email', 'phone', 'message']
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Your name'}),
            'email': forms.EmailInput(attrs={'placeholder': 'you@company.com'}),
            'phone': forms.TextInput(attrs={'placeholder': '+1 555 555 5555'}),
            'message': forms.Textarea(attrs={'placeholder': 'How can we help you?', 'rows': 5}),
        }
