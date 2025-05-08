from rest_framework import serializers
from .models import Article, Recommendation, User, ArticleCategory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleCategory
        fields = ['id', 'name']

class ArticleSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()
    header_image = serializers.SerializerMethodField()
    formatted_content = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'title', 'summary', 'content', 'formatted_content',
                 'categories', 'image', 'header_image', 'created_at']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_header_image(self, obj):
        request = self.context.get('request')
        if obj.header_image and hasattr(obj.header_image, 'url'):
            return request.build_absolute_uri(obj.header_image.url)
        return None

    def get_formatted_content(self, obj):
        """Ensure consistent HTML formatting"""
        return obj.content.replace('\n', '').strip() if obj.content else None

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RecommendationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    article = ArticleSerializer(read_only=True)

    class Meta:
        model = Recommendation
        fields = ['id', 'user', 'article', 'interaction_type', 'created_at', 'weight']