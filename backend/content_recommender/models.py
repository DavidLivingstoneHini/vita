from django.db import models
from django.contrib.auth import get_user_model
from ckeditor.fields import RichTextField

User = get_user_model()

class ArticleCategory(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    parent_category = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

class Article(models.Model):
    title = models.CharField(max_length=255)
    summary = models.TextField(blank=True)
    content = RichTextField()
    image = models.ImageField(upload_to='articles/', blank=True, null=True)
    header_image = models.ImageField(upload_to='article_headers/', blank=True, null=True)
    categories = models.ManyToManyField(ArticleCategory, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def clean_content(self):
        """Ensure content has proper HTML structure"""
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(self.content, 'html.parser')
        return str(soup.prettify())

    def save(self, *args, **kwargs):
        self.content = self.clean_content()
        super().save(*args, **kwargs)

class ArticleSection(models.Model):
    article = models.ForeignKey(Article, related_name='sections', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.article.title} - {self.title}"

class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interactions')
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    interaction_type = models.CharField(max_length=10, choices=[
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('share', 'Share'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    weight = models.SmallIntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} - {self.article.title} - {self.interaction_type}"