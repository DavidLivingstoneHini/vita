# content_recommender/urls.py
from django.urls import path
from .views import (
    ArticleListView,
    ArticleDetailView,
    RecommendedArticlesView,
    HybridRecommendationView,
    ContentBasedRecommendationView,
    CollaborativeFilteringRecommendationView,
    MatrixFactorizationRecommendationView, ArticleSearchView
)
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# Remove app_name if you're not using namespace URLs
app_name = 'content_recommender'

schema_view = get_schema_view(
    openapi.Info(
        title="Content Recommender API",
        default_version='v1',
        description="API for article recommendations",
    ),
    public=True,
    permission_classes=[permissions.IsAuthenticated],
)

urlpatterns = [
    # Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # API Endpoints
    path('api/articles/', ArticleListView.as_view(), name='article-list'),
    path('api/articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
    path('api/recommended/', RecommendedArticlesView.as_view(), name='recommended-articles'),
    path('api/recommended/hybrid/', HybridRecommendationView.as_view(), name='hybrid-recommendations'),
    path('api/recommended/content-based/', ContentBasedRecommendationView.as_view(), name='content-based-recommendations'),
    path('api/recommended/collaborative-filtering/', CollaborativeFilteringRecommendationView.as_view(),
         name='collab-filter-recommendations'),
    path('api/recommended/matrix-factorization/', MatrixFactorizationRecommendationView.as_view(),
         name='matrix-factor-recommendations'),
    path('api/articles/search/', ArticleSearchView.as_view(), name='article-search'),
]