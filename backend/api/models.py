from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    rating = models.FloatField(default=0.0)
    description = models.TextField()
    url = models.URLField(unique=True)
    genre = models.CharField(max_length=100, blank=True)
    summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title