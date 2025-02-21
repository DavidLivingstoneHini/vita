from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Article(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    content = models.TextField()
    text_index = models.TextField(db_index=True, editable=False)  # For full-text search
    categories = models.ManyToManyField('Category', blank=True)
    embeddings = models.JSONField(null=True, blank=True)  # For article embeddings
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Preprocess content and update text_index
        self.text_index = self._preprocess_content(self.content)
        super().save(*args, **kwargs)

    def _preprocess_content(self, content):
        # Basic preprocessing example; enhance as needed
        return ' '.join(content.split()[:100])  # Truncate to first 100 words

class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    parent_category = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interactions')
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    interaction_type = models.CharField(max_length=10, choices=[
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('share', 'Share'),  # Example additional interaction type
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    weight = models.SmallIntegerField(default=1)  # Assign weights to interactions

    def __str__(self):
        return f"{self.user.username} - {self.article.title} - {self.interaction_type}"
