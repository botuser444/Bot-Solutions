"""
Models for website app.
Contains a simple Contact model to save form submissions.
"""
from django.db import models


class Contact(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} <{self.email}>"
