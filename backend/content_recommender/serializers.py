from rest_framework import serializers
from.models import Article, Recommendation, User, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class ArticleSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'categories', 'embeddings', 'created_at']  # Include created_at if added to the model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class NestedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']  # Limited fields for nested serialization

class NestedArticleSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'title', 'categories']  # Limited fields for nested serialization

class RecommendationSerializer(serializers.ModelSerializer):
    user = NestedUserSerializer(read_only=True)
    article = NestedArticleSerializer(read_only=True)

    class Meta:
        model = Recommendation
        fields = ['id', 'user', 'article', 'interaction_type', 'created_at', 'weight']
